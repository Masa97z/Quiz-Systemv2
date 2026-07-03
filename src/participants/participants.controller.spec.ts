import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ParticipantsController', () => {
  let controller: ParticipantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantsController],
      providers: [
        ParticipantsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ParticipantsController>(ParticipantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
