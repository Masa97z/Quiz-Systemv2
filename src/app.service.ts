// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. إجمالي المشتركين
    const totalParticipants = await this.prisma.participant.count();

    // 2. المسابقات النشطة
    const activeQuizzes = await this.prisma.quiz.count();

    // 3. نسبة الإجابات الصحيحة (متوسط النقاط)
    const submissions = await this.prisma.submission.findMany({
      include: { quiz: { include: { questions: true } } }
    });
    
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;

    submissions.forEach(sub => {
      totalQuestionsAnswered += sub.quiz.questions.length;
      totalCorrectAnswers += sub.score;
    });

    const successRate = totalQuestionsAnswered === 0 ? 0 : Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100);

    // 4. أحدث المشاركات الواردة
    const recentActivity = await this.prisma.submission.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      include: {
        quiz: true,
        participant: true,
      }
    });

    // تنسيق المشاركات الأخيرة للواجهة الأمامية
    const formattedActivity = recentActivity.map(act => ({
      id: act.id,
      code: act.participant.code,
      quiz: act.quiz.title,
      score: act.score,
      time: 'مؤخراً' // يمكنك استخدام مكتبة مثل date-fns لحساب الوقت الفعلي
    }));

    return {
      stats: [
        { title: 'إجمالي المشتركين', value: totalParticipants.toString(), icon: '👥' },
        { title: 'الإجابات الصحيحة', value: `${successRate}%`, icon: '✅' },
        { title: 'المسابقات النشطة', value: activeQuizzes.toString(), icon: '🔥' },
      ],
      recentActivity: formattedActivity
    };
  }
}