import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
export declare class ParticipantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createParticipantDto: CreateParticipantDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            submissions: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    })[]>;
    updateParticipant(id: number, data: {
        name?: string;
    }): import(".prisma/client").Prisma.Prisma__ParticipantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    validateParticipant(code: string, secretCode: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    }>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ParticipantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
