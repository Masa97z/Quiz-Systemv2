import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
    create(createQuizDto: CreateQuizDto): Promise<{
        questions: {
            id: number;
            quizId: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: string;
            options: string | null;
            correctAnswer: string | null;
        }[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
    findAll(): Promise<({
        submissions: {
            id: number;
            quizId: number;
            participantId: number;
            score: number;
            answers: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        questions: {
            id: number;
            quizId: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: string;
            options: string | null;
            correctAnswer: string | null;
        }[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    })[]>;
    findByCode(code: string): Promise<{
        questions: {
            id: number;
            quizId: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: string;
            options: string | null;
            correctAnswer: string | null;
        }[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
    findOne(id: number): Promise<{
        submissions: ({
            participant: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                code: string;
                secretCode: string;
                totalScore: number;
            };
        } & {
            id: number;
            quizId: number;
            participantId: number;
            score: number;
            answers: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        questions: {
            id: number;
            quizId: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: string;
            options: string | null;
            correctAnswer: string | null;
        }[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
    update(id: number, updateQuizDto: any): Promise<{
        questions: {
            id: number;
            quizId: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: string;
            options: string | null;
            correctAnswer: string | null;
        }[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
    remove(id: number): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
    toggleStatus(id: number): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
    endQuiz(id: number): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        endedAt: Date | null;
    }>;
}
