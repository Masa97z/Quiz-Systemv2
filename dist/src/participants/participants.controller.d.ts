import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
export declare class ParticipantsController {
    private readonly participantsService;
    constructor(participantsService: ParticipantsService);
    create(createParticipantDto: CreateParticipantDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
        totalScore: number;
    }[]>;
    login(code: string, secretCode: string): Promise<{
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
