import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    submitQuiz(dto: CreateSubmissionDto): Promise<{
        message: string;
        score: number;
        totalQuestions: number;
    }>;
    getLeaderboard(): Promise<{
        code: string;
        name: string | null;
        totalScore: number;
    }[]>;
}
