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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubmissionsService = class SubmissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitQuiz(dto) {
        const participant = await this.prisma.participant.findUnique({
            where: { code: dto.participantCode },
        });
        if (!participant)
            throw new common_1.NotFoundException('المتسابق غير موجود');
        const existingSubmission = await this.prisma.submission.findFirst({
            where: { quizId: dto.quizId, participantId: participant.id },
        });
        if (existingSubmission)
            throw new common_1.BadRequestException('لقد قمت بالمشاركة في هذه المسابقة مسبقاً!');
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: dto.quizId },
            include: {
                questions: {
                    orderBy: { id: 'asc' },
                },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('المسابقة غير موجودة');
        if (!quiz.isActive)
            throw new common_1.BadRequestException('عذراً، تم إيقاف استقبال المشاركات لهذه المسابقة.');
        let score = 0;
        quiz.questions.forEach((question, index) => {
            const userAnswer = dto.answers[index];
            if (userAnswer !== undefined && userAnswer !== null && userAnswer.toString().trim() === question.correctAnswer?.toString().trim()) {
                score += 1;
            }
        });
        const [submission] = await this.prisma.$transaction([
            this.prisma.submission.create({
                data: {
                    quizId: quiz.id,
                    participantId: participant.id,
                    score: score,
                    answers: JSON.stringify(dto.answers)
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
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map