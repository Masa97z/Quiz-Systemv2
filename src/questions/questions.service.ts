// src/questions/questions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // 1. إضافة سؤال جديد لمسابقة موجودة
  async create(createQuestionDto: CreateQuestionDto) {
    // نتحقق أولاً من وجود المسابقة
    const quizExists = await this.prisma.quiz.findUnique({
      where: { id: createQuestionDto.quizId }
    });
    
    if (!quizExists) throw new NotFoundException('المسابقة المحددة غير موجودة');

    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  // 2. جلب جميع الأسئلة التابعة لمسابقة معينة
  findByQuiz(quizId: number) {
    return this.prisma.question.findMany({
      where: { quizId: quizId },
      orderBy: { id: 'asc' }
    });
  }

  // 3. جلب تفاصيل سؤال محدد
  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException('السؤال غير موجود');
    return question;
  }

  // 4. تعديل سؤال (مثل تصحيح خطأ إملائي أو تغيير الإجابة الصحيحة)
  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  // 5. حذف سؤال محدد
  remove(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}