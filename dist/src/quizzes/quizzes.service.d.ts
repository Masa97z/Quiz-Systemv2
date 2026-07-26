import { PrismaService } from '../prisma/prisma.service';
export declare class QuizzesService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseId;
    private parseOptionalInt;
    private ensureSubcategory;
    create(createQuizDto: any): Promise<{
        subcategory: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            points: number;
            categoryId: number;
            description: string | null;
        }) | null;
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
        points: number;
        subcategoryId: number | null;
        endedAt: Date | null;
    }>;
    findAll(): Promise<({
        subcategory: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            points: number;
            categoryId: number;
            description: string | null;
        }) | null;
        submissions: {
            id: number;
            quizId: number;
            participantId: number;
            score: number;
            earnedPoints: number;
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
        points: number;
        subcategoryId: number | null;
        endedAt: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        subcategory: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            points: number;
            categoryId: number;
            description: string | null;
        }) | null;
        submissions: ({
            participant: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                code: string;
                secretCode: string;
            };
        } & {
            id: number;
            quizId: number;
            participantId: number;
            score: number;
            earnedPoints: number;
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
        points: number;
        subcategoryId: number | null;
        endedAt: Date | null;
    }>;
    findByCode(code: string): Promise<{
        subcategory: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            points: number;
            categoryId: number;
            description: string | null;
        }) | null;
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
        points: number;
        subcategoryId: number | null;
        endedAt: Date | null;
    }>;
    update(id: number, updateQuizDto: any): Promise<{
        subcategory: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            points: number;
            categoryId: number;
            description: string | null;
        }) | null;
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
        points: number;
        subcategoryId: number | null;
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
        points: number;
        subcategoryId: number | null;
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
        points: number;
        subcategoryId: number | null;
        endedAt: Date | null;
    }>;
    createCategory(createCategoryDto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    findAllCategories(): Promise<({
        subcategories: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            points: number;
            categoryId: number;
            description: string | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    })[]>;
    createSubcategory(createSubcategoryDto: any): Promise<{
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        points: number;
        categoryId: number;
        description: string | null;
    }>;
    findAllSubcategories(): Promise<({
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
        quizzes: {
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            quizCode: string;
            isActive: boolean;
            timeLimit: number | null;
            points: number;
            subcategoryId: number | null;
            endedAt: Date | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        points: number;
        categoryId: number;
        description: string | null;
    })[]>;
    remove(id: number): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        quizCode: string;
        isActive: boolean;
        timeLimit: number | null;
        points: number;
        subcategoryId: number | null;
        endedAt: Date | null;
    }>;
}
