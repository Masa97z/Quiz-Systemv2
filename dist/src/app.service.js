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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalParticipants = await this.prisma.participant.count();
        const totalQuizzes = await this.prisma.quiz.count();
        const completedQuizzes = await this.prisma.quiz.count({ where: { status: 'ENDED' } });
        const activeQuizzes = await this.prisma.quiz.count({ where: { status: 'ACTIVE' } });
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
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map