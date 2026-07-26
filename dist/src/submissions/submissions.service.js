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
    calculateEarnedPoints(quiz, rawScore, totalQuestions) {
        if (totalQuestions <= 0)
            return 0;
        const quizPoints = Number(quiz.points ?? 0);
        const subcategoryPoints = Number(quiz.subcategory?.points ?? 0);
        const basePoints = quizPoints > 0 ? quizPoints : subcategoryPoints;
        if (basePoints <= 0)
            return rawScore;
        return Math.round((rawScore / totalQuestions) * basePoints);
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
                subcategory: true,
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
        const earnedPoints = this.calculateEarnedPoints(quiz, score, quiz.questions.length);
        await this.prisma.$transaction([
            this.prisma.submission.create({
                data: {
                    quizId: quiz.id,
                    participantId: participant.id,
                    score,
                    earnedPoints,
                    answers: JSON.stringify(dto.answers)
                },
            }),
        ]);
        return {
            message: 'تم استلام الإجابات بنجاح',
            score: score,
            totalQuestions: quiz.questions.length
        };
    }
    async getSubcategoryProgress(subcategoryId, participantCode) {
        const participant = await this.prisma.participant.findUnique({
            where: { code: participantCode },
        });
        if (!participant)
            throw new common_1.NotFoundException('المتسابق غير موجود');
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
        if (!subcategory)
            throw new common_1.NotFoundException('التصنيف الفرعي غير موجود');
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
    async getLeaderboard() {
        const submissions = await this.prisma.submission.findMany({
            include: {
                participant: true,
            },
            orderBy: [{ earnedPoints: 'desc' }, { score: 'desc' }, { createdAt: 'asc' }],
            take: 50,
        });
        const leaderboardMap = new Map();
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
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map