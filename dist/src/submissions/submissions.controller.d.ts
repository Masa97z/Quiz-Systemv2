import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    submit(createSubmissionDto: CreateSubmissionDto): Promise<{
        message: string;
        score: number;
        totalQuestions: number;
    }>;
    getSubcategoryProgress(id: number, participantCode: string): Promise<{
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
