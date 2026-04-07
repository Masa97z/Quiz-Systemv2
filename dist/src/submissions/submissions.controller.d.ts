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
    getLeaderboard(): Promise<{
        code: string;
        name: string | null;
        totalScore: number;
    }[]>;
}
