import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuestionDto: CreateQuestionDto): Promise<{
        id: number;
        quizId: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        type: string;
        options: string | null;
        correctAnswer: string | null;
    }>;
    findByQuiz(quizId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        quizId: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        type: string;
        options: string | null;
        correctAnswer: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        quizId: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        type: string;
        options: string | null;
        correctAnswer: string | null;
    }>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        quizId: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        type: string;
        options: string | null;
        correctAnswer: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        quizId: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        type: string;
        options: string | null;
        correctAnswer: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
