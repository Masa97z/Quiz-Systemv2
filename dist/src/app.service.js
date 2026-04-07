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
        const activeQuizzes = await this.prisma.quiz.count();
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
        return {
            stats: [
                { title: 'إجمالي المشتركين', value: totalParticipants.toString(), icon: '👥' },
                { title: 'الإجابات الصحيحة', value: `${successRate}%`, icon: '✅' },
                { title: 'المسابقات النشطة', value: activeQuizzes.toString(), icon: '🔥' },
            ],
            recentActivity: formattedActivity
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map