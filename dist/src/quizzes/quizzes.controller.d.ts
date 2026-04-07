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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
    }>;
    findAll(): Promise<({
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
        submissions: {
            id: number;
            quizId: number;
            participantId: number;
            score: number;
            answers: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
    }>;
    findOne(id: number): Promise<{
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
    }>;
    toggleStatus(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
    }>;
}
