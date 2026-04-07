// src/submissions/submissions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) { }

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

    // حفظ النتيجة النهائية في قاعدة البيانات وزيادة إجمالي النقاط للمتسابق
    const [submission] = await this.prisma.$transaction([
      this.prisma.submission.create({
        data: {
          quizId: quiz.id,
          participantId: participant.id,
          score: score,
          answers: JSON.stringify(dto.answers) // حفظ إجابات الطالب
        },
      }),
      this.prisma.participant.update({
        where: { id: participant.id },
        data: {
          totalScore: { increment: score }
        }
      })
    ]);

    return {
      message: 'تم استلام الإجابات بنجاح',
      score: score,
      totalQuestions: quiz.questions.length
    };
  }

  // 2. جلب لوحة الشرف (أعلى المتسابقين نقاطاً في جميع المسابقات)
  async getLeaderboard() {
    const participants = await this.prisma.participant.findMany({
      orderBy: { totalScore: 'desc' },
      take: 10,
    });

    return participants.map(participant => ({
      code: participant.code,
      name: participant.name,
      totalScore: participant.totalScore
    }));
  }
}