import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    private calculateEarnedPoints;
    submitQuiz(dto: CreateSubmissionDto): Promise<{
        message: string;
        score: number;
        totalQuestions: number;
    }>;
    getSubcategoryProgress(subcategoryId: number, participantCode: string): Promise<{
        subcategoryId: number;
        subcategoryName: string;
        participantCode: string;
        participantName: string | null;
        requiredQuizzes: number;
        completedQuizzes: number;
        isFullyCompleted: boolean;
        quizResults: {
            quizId: number;
            title: string;
            score: number;
            earnedPoints: number;
            totalQuestions: number;
            isComplete: boolean;
        }[];
    }>;
    getLeaderboard(): Promise<{
        code: string;
        name: string | null;
        totalScore: number;
    }[]>;
}
