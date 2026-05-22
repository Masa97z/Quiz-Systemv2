// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. إجمالي المشتركين
    const totalParticipants = await this.prisma.participant.count();

    // 2. إجمالي المسابقات
    const totalQuizzes = await this.prisma.quiz.count();

    // 3. المسابقات المكتملة
    const completedQuizzes = await this.prisma.quiz.count({ where: { status: 'ENDED' } });

    // 4. المسابقات النشطة
    const activeQuizzes = await this.prisma.quiz.count({ where: { status: 'ACTIVE' } });

    // 5. أحدث المشاركات الواردة
    const recentActivity = await this.prisma.submission.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      include: {
        quiz: true,
        participant: true,
      }
    });

    const formattedActivity = recentActivity.map(act => ({
      id: act.id,
      code: act.participant.code,
      quiz: act.quiz.title,
      score: act.score,
      time: 'مؤخراً'
    }));

    // 6. قائمة المسابقات للفرز في لوحة التحكم
    const quizzesListRaw = await this.prisma.quiz.findMany({
      include: {
        _count: { select: { submissions: true } },
        submissions: { select: { score: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedQuizzesList = quizzesListRaw.map(q => {
      const maxScore = q.submissions.reduce((max, sub) => sub.score > max ? sub.score : max, 0);
      const winnersCount = q.submissions.filter(sub => sub.score === maxScore && maxScore > 0).length;
      return {
        id: q.id,
        title: q.title,
        quizCode: q.quizCode,
        status: q.status,
        createdAt: q.createdAt,
        participantsCount: q._count.submissions,
        winnersCount: winnersCount
      };
    });

    return {
      stats: [
        { title: 'إجمالي المشتركين', value: totalParticipants.toString(), icon: '👥' },
        { title: 'إجمالي المسابقات', value: totalQuizzes.toString(), icon: '📚' },
        { title: 'المسابقات المكتملة', value: completedQuizzes.toString(), icon: '✅' },
        { title: 'المسابقات النشطة', value: activeQuizzes.toString(), icon: '🔥' },
      ],
      recentActivity: formattedActivity,
      quizzesList: formattedQuizzesList
    };
  }
}