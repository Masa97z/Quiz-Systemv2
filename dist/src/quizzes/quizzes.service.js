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
    async create(createQuizDto) {
        const quizCode = Math.floor(100000 + Math.random() * 900000).toString();
        return this.prisma.quiz.create({
            data: {
                title: createQuizDto.title,
                quizCode,
                timeLimit: createQuizDto.timeLimit ? parseInt(createQuizDto.timeLimit) : null,
                questions: {
                    create: createQuizDto.questions,
                },
            },
            include: {
                questions: true,
            },
        });
    }
    async findAll() {
        return this.prisma.quiz.findMany({
            include: {
                questions: true,
                submissions: true,
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
                submissions: {
                    include: {
                        participant: true,
                    },
                    orderBy: {
                        score: 'desc'
                    }
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
                questions: { orderBy: { id: 'asc' } }
            }
        });
        if (!quiz)
            throw new common_1.NotFoundException('رمز المسابقة غير صحيح أو المسابقة غير موجودة');
        return quiz;
    }
    async update(id, updateQuizDto) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        return this.prisma.quiz.update({
            where: { id },
            data: {
                title: updateQuizDto.title,
                timeLimit: updateQuizDto.timeLimit ? parseInt(updateQuizDto.timeLimit) : null,
                questions: {
                    deleteMany: {},
                    create: updateQuizDto.questions,
                },
            },
            include: {
                questions: true,
            },
        });
    }
    async toggleStatus(id) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        return this.prisma.quiz.update({
            where: { id },
            data: { isActive: !quiz.isActive },
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