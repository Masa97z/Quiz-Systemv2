// src/quizzes/quizzes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء مسابقة جديدة مع أسئلتها دفعة واحدة (Nested Write)
  async create(createQuizDto: any) {
    const quizCode = Math.floor(100000 + Math.random() * 900000).toString();
    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        quizCode,
        timeLimit: createQuizDto.timeLimit ? parseInt(createQuizDto.timeLimit) : null,
        questions: {
          create: createQuizDto.questions, // إنشاء الأسئلة المرتبطة فوراً
        },
      },
      include: {
        questions: true, // إرجاع المسابقة مع أسئلتها بعد الإنشاء
      },
    });
  }

  // 2. جلب جميع المسابقات للوحة التحكم (مع عدد الأسئلة والمشاركين)
  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        questions: true,
        submissions: true, // لجلب إحصائيات المشاركين
      },
      orderBy: {
        createdAt: 'desc', // ترتيب من الأحدث للأقدم
      }
    });
  }

  // 3. جلب مسابقة محددة بكل تفاصيلها (الأسئلة والنتائج والمشتركين)
  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        submissions: {
          include: {
            participant: true, // جلب بيانات المتسابق صاحب النتيجة
          },
          orderBy: {
            score: 'desc' // ترتيب النتائج من الأعلى للأقل
          }
        },
      },
    });

    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');
    return quiz;
  }

  async findByCode(code: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { quizCode: code },
      include: {
        questions: { orderBy: { id: 'asc' } }
      }
    });
    if (!quiz) throw new NotFoundException('رمز المسابقة غير صحيح أو المسابقة غير موجودة');
    return quiz;
  }

  // 4. تحديث مسابقة بالكامل
  async update(id: number, updateQuizDto: any) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');

    return this.prisma.quiz.update({
      where: { id },
      data: {
        title: updateQuizDto.title,
        timeLimit: updateQuizDto.timeLimit ? parseInt(updateQuizDto.timeLimit) : null,
        questions: {
          deleteMany: {}, // حذف القديم
          create: updateQuizDto.questions, // إنشاء الأسئلة الجديدة المرفقة
        },
      },
      include: {
        questions: true,
      },
    });
  }

  // 5. تغيير حالة المسابقة (تفعيل/إيقاف)
  async toggleStatus(id: number) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');

    return this.prisma.quiz.update({
      where: { id },
      data: { isActive: !quiz.isActive },
    });
  }

  // 5. حذف مسابقة
  async remove(id: number) {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}