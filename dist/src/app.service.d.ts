import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        stats: {
            title: string;
            value: string;
            icon: string;
        }[];
        recentActivity: {
            id: number;
            code: string;
            quiz: string;
            score: number;
            time: string;
        }[];
        quizzesList: {
            id: number;
            title: string;
            quizCode: string;
            status: string;
            createdAt: Date;
            participantsCount: number;
            winnersCount: number;
        }[];
    }>;
}
