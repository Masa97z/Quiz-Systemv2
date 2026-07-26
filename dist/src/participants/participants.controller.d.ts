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
    })[]>;
    login(code: string, secretCode: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
    }>;
    update(id: number, updateData: {
        name?: string;
    }): import(".prisma/client").Prisma.Prisma__ParticipantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ParticipantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        code: string;
        secretCode: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
