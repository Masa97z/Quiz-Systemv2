// src/submissions/submissions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) { }

  private calculateEarnedPoints(quiz: { points?: number | null; subcategory?: { points?: number | null } | null }, rawScore: number, totalQuestions: number) {
    if (totalQuestions <= 0) return 0;

    const quizPoints = Number(quiz.points ?? 0);
    const subcategoryPoints = Number(quiz.subcategory?.points ?? 0);
    const basePoints = quizPoints > 0 ? quizPoints : subcategoryPoints;

    if (basePoints <= 0) return rawScore;

    return Math.round((rawScore / totalQuestions) * basePoints);
  }

  // 1. استلام الإجابات، تصحيحها، وحفظ النتيجة
  async submitQuiz(dto: CreateSubmissionDto) {
    // جلب المتسابق
    const participant = await this.prisma.participant.findUnique({
      where: { code: dto.participantCode },
    });
    if (!participant) throw new NotFoundException('المتسابق غير موجود');

    // التحقق مما إذا كان المتسابق قد شارك في هذه المسابقة مسبقاً
    const existingSubmission = await this.prisma.submission.findFirst({
      where: { quizId: dto.quizId, participantId: participant.id },
    });
    if (existingSubmission) throw new BadRequestException('لقد قمت بالمشاركة في هذه المسابقة مسبقاً!');

    // جلب المسابقة بأسئلتها
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: dto.quizId },
      include: {
        questions: {
          orderBy: { id: 'asc' }, // لضمان الترتيب الصحيح للأسئلة
        },
        subcategory: true,
      },
    });
    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');
    if (!quiz.isActive) throw new BadRequestException('عذراً، تم إيقاف استقبال المشاركات لهذه المسابقة.');

    // حساب النتيجة (التصحيح التلقائي)
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = dto.answers[index];
      // تطابق الإجابة (سواء كانت نصية أو اختيار من متعدد)
      if (userAnswer !== undefined && userAnswer !== null && userAnswer.toString().trim() === question.correctAnswer?.toString().trim()) {
        score += 1;
      }
    });

    const earnedPoints = this.calculateEarnedPoints(quiz, score, quiz.questions.length);

    // حفظ النتيجة النهائية في قاعدة البيانات لكل مشارك داخل المسابقة
    await this.prisma.$transaction([
      this.prisma.submission.create({
        data: {
          quizId: quiz.id,
          participantId: participant.id,
          score,
          earnedPoints,
          answers: JSON.stringify(dto.answers) // حفظ إجابات الطالب
        },
      }),
    ]);

    return {
      message: 'تم استلام الإجابات بنجاح',
      score: score,
      totalQuestions: quiz.questions.length
    };
  }

  async getSubcategoryProgress(subcategoryId: number, participantCode: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { code: participantCode },
    });
    if (!participant) throw new NotFoundException('المتسابق غير موجود');

    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        quizzes: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!subcategory) throw new NotFoundException('التصنيف الفرعي غير موجود');

    const quizResults = await Promise.all(subcategory.quizzes.map(async (quiz) => {
      const submission = await this.prisma.submission.findFirst({
        where: { quizId: quiz.id, participantId: participant.id },
      });

      const totalQuestions = quiz.questions.length;
      const isComplete = Boolean(submission && submission.score === totalQuestions && totalQuestions > 0);

      return {
        quizId: quiz.id,
        title: quiz.title,
        score: submission?.score ?? 0,
        earnedPoints: submission?.earnedPoints ?? 0,
        totalQuestions,
        isComplete,
      };
    }));

    const completedQuizzes = quizResults.filter((quizResult) => quizResult.isComplete).length;

    return {
      subcategoryId: subcategory.id,
      subcategoryName: subcategory.name,
      participantCode: participant.code,
      participantName: participant.name,
      requiredQuizzes: quizResults.length,
      completedQuizzes,
      isFullyCompleted: quizResults.length > 0 && completedQuizzes === quizResults.length,
      quizResults,
    };
  }

  // 2. جلب لوحة الشرف (أعلى المتسابقين نقاطاً في جميع المسابقات)
  async getLeaderboard() {
    const submissions = await this.prisma.submission.findMany({
      include: {
        participant: true,
      },
      orderBy: [{ earnedPoints: 'desc' }, { score: 'desc' }, { createdAt: 'asc' }],
      take: 50,
    });

    const leaderboardMap = new Map<number, { code: string; name: string | null; totalScore: number }>();

    submissions.forEach((submission) => {
      const participant = submission.participant;
      const existing = leaderboardMap.get(participant.id);

      if (existing) {
        existing.totalScore += submission.earnedPoints;
        return;
      }

      leaderboardMap.set(participant.id, {
        code: participant.code,
        name: participant.name,
        totalScore: submission.earnedPoints,
      });
    });

    return Array.from(leaderboardMap.values())
      .sort((a, b) => b.totalScore - a.totalScore || (a.name ?? '').localeCompare(b.name ?? ''))
      .slice(0, 10)
      .map((entry) => ({
        code: entry.code,
        name: entry.name,
        totalScore: entry.totalScore,
      }));
  }
}