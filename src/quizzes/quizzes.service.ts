// src/quizzes/quizzes.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  private parseId(value: number | string | null | undefined, fieldName: string) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException(`قيمة ${fieldName} غير صحيحة`);
    }
    return parsed;
  }

  private parseOptionalInt(value: number | string | null | undefined, fieldName: string) {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException(`قيمة ${fieldName} غير صحيحة`);
    }
    return parsed;
  }

  private async ensureSubcategory(subcategoryId: number | string | null | undefined) {
    const parsedId = this.parseId(subcategoryId, 'subcategoryId');
    if (parsedId === null) return null;

    const subcategory = await this.prisma.subcategory.findUnique({ where: { id: parsedId } });
    if (!subcategory) throw new NotFoundException('التصنيف الفرعي غير موجود');
    return parsedId;
  }

  // 1. إنشاء مسابقة جديدة مع أسئلتها دفعة واحدة (Nested Write)
  async create(createQuizDto: any) {
    const quizCode = Math.floor(100000 + Math.random() * 900000).toString();
    const subcategoryId = await this.ensureSubcategory(createQuizDto.subcategoryId);

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        quizCode,
        subcategoryId,
        timeLimit: createQuizDto.timeLimit ? parseInt(String(createQuizDto.timeLimit), 10) : null,
        points: this.parseOptionalInt(createQuizDto.points, 'points'),
        questions: {
          create: createQuizDto.questions ?? [], // إنشاء الأسئلة المرتبطة فوراً
        },
      },
      include: {
        questions: true,
        subcategory: {
          include: { category: true },
        },
      },
    });
  }

  // 2. جلب جميع المسابقات للوحة التحكم (مع عدد الأسئلة والمشاركين)
  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        questions: true,
        submissions: {
          include: {
            participant: true,
          },
        },
        subcategory: {
          include: { category: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  }

  // 3. جلب مسابقة محددة بكل تفاصيلها (الأسئلة والنتائج والمشتركين)
  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        subcategory: {
          include: { category: true },
        },
        submissions: {
          include: {
            participant: true,
          },
          orderBy: [
            { earnedPoints: 'desc' },
            { score: 'desc' }
          ]
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
        questions: { orderBy: { id: 'asc' } },
        subcategory: {
          include: { category: true },
        },
      }
    });
    if (!quiz) throw new NotFoundException('رمز المسابقة غير صحيح أو المسابقة غير موجودة');
    if (quiz.status === 'ENDED') throw new NotFoundException('عذراً، هذه المسابقة منتهية ولا يمكن الدخول إليها');
    if (quiz.status === 'PAUSED' || !quiz.isActive) throw new NotFoundException('المسابقة متوقفة مؤقتاً');
    return quiz;
  }

  // 4. تحديث مسابقة بالكامل
  async update(id: number, updateQuizDto: any) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');

    const data: any = {
      title: updateQuizDto.title,
      timeLimit: updateQuizDto.timeLimit ? parseInt(String(updateQuizDto.timeLimit), 10) : null,
      points: updateQuizDto.points !== undefined ? this.parseOptionalInt(updateQuizDto.points, 'points') : undefined,
      questions: {
        deleteMany: {},
        create: updateQuizDto.questions ?? [],
      },
    };

    if (updateQuizDto.subcategoryId !== undefined) {
      data.subcategoryId = await this.ensureSubcategory(updateQuizDto.subcategoryId);
    }

    return this.prisma.quiz.update({
      where: { id },
      data,
      include: {
        questions: true,
        subcategory: {
          include: { category: true },
        },
      },
    });
  }

  // 5. تغيير حالة المسابقة (تفعيل/إيقاف)
  async toggleStatus(id: number) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');
    if (quiz.status === 'ENDED') throw new NotFoundException('لا يمكن تغيير حالة مسابقة منتهية');

    const newStatus = quiz.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const newIsActive = newStatus === 'ACTIVE';

    return this.prisma.quiz.update({
      where: { id },
      data: { status: newStatus, isActive: newIsActive },
    });
  }

  // إنهاء المسابقة بشكل نهائي
  async endQuiz(id: number) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('المسابقة غير موجودة');
    if (quiz.status === 'ENDED') throw new NotFoundException('المسابقة منتهية بالفعل');

    return this.prisma.quiz.update({
      where: { id },
      data: {
        status: 'ENDED',
        isActive: false,
        endedAt: new Date()
      },
    });
  }

  async createCategory(createCategoryDto: any) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description ?? null,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSubcategory(createSubcategoryDto: any) {
    const categoryId = this.parseId(createSubcategoryDto.categoryId, 'categoryId');
    if (categoryId === null) throw new BadRequestException('يجب اختيار التصنيف الرئيسي');

    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('التصنيف الرئيسي غير موجود');

    return this.prisma.subcategory.create({
      data: {
        categoryId,
        name: createSubcategoryDto.name,
        description: createSubcategoryDto.description ?? null,
        points: this.parseOptionalInt(createSubcategoryDto.points, 'points'),
      },
      include: { category: true },
    });
  }

  async findAllSubcategories() {
    return this.prisma.subcategory.findMany({
      include: {
        category: true,
        quizzes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 5. حذف مسابقة
  async remove(id: number) {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}