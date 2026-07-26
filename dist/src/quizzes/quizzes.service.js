"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuizzesService = class QuizzesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseId(value, fieldName) {
        if (value === null || value === undefined || value === '')
            return null;
        const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
        if (!Number.isInteger(parsed)) {
            throw new common_1.BadRequestException(`قيمة ${fieldName} غير صحيحة`);
        }
        return parsed;
    }
    parseOptionalInt(value, fieldName) {
        if (value === null || value === undefined || value === '')
            return 0;
        const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
        if (!Number.isInteger(parsed)) {
            throw new common_1.BadRequestException(`قيمة ${fieldName} غير صحيحة`);
        }
        return parsed;
    }
    async ensureSubcategory(subcategoryId) {
        const parsedId = this.parseId(subcategoryId, 'subcategoryId');
        if (parsedId === null)
            return null;
        const subcategory = await this.prisma.subcategory.findUnique({ where: { id: parsedId } });
        if (!subcategory)
            throw new common_1.NotFoundException('التصنيف الفرعي غير موجود');
        return parsedId;
    }
    async create(createQuizDto) {
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
                    create: createQuizDto.questions ?? [],
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
    async findAll() {
        return this.prisma.quiz.findMany({
            include: {
                questions: true,
                submissions: true,
                subcategory: {
                    include: { category: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
    }
    async findOne(id) {
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
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        return quiz;
    }
    async findByCode(code) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { quizCode: code },
            include: {
                questions: { orderBy: { id: 'asc' } },
                subcategory: {
                    include: { category: true },
                },
            }
        });
        if (!quiz)
            throw new common_1.NotFoundException('رمز المسابقة غير صحيح أو المسابقة غير موجودة');
        if (quiz.status === 'ENDED')
            throw new common_1.NotFoundException('عذراً، هذه المسابقة منتهية ولا يمكن الدخول إليها');
        if (quiz.status === 'PAUSED' || !quiz.isActive)
            throw new common_1.NotFoundException('المسابقة متوقفة مؤقتاً');
        return quiz;
    }
    async update(id, updateQuizDto) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        const data = {
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
    async toggleStatus(id) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        if (quiz.status === 'ENDED')
            throw new common_1.NotFoundException('لا يمكن تغيير حالة مسابقة منتهية');
        const newStatus = quiz.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        const newIsActive = newStatus === 'ACTIVE';
        return this.prisma.quiz.update({
            where: { id },
            data: { status: newStatus, isActive: newIsActive },
        });
    }
    async endQuiz(id) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        if (quiz.status === 'ENDED')
            throw new common_1.NotFoundException('المسابقة منتهية بالفعل');
        return this.prisma.quiz.update({
            where: { id },
            data: {
                status: 'ENDED',
                isActive: false,
                endedAt: new Date()
            },
        });
    }
    async createCategory(createCategoryDto) {
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
    async createSubcategory(createSubcategoryDto) {
        const categoryId = this.parseId(createSubcategoryDto.categoryId, 'categoryId');
        if (categoryId === null)
            throw new common_1.BadRequestException('يجب اختيار التصنيف الرئيسي');
        const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
        if (!category)
            throw new common_1.NotFoundException('التصنيف الرئيسي غير موجود');
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
    async remove(id) {
        return this.prisma.quiz.delete({
            where: { id },
        });
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map