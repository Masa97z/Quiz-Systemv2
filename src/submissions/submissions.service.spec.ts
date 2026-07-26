import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        {
          provide: PrismaService,
          useValue: {
            participant: { findUnique: jest.fn(), update: jest.fn() },
            subcategory: { findUnique: jest.fn() },
            submission: { findFirst: jest.fn(), create: jest.fn() },
            quiz: { findUnique: jest.fn() },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should mark a subcategory as fully completed only when every quiz is completed with full score', async () => {
    jest.spyOn(prisma.participant as any, 'findUnique').mockResolvedValue({ id: 1, code: 'ABC123', name: 'Ali' });
    jest.spyOn(prisma.subcategory as any, 'findUnique').mockResolvedValue({
      id: 7,
      name: 'العربية',
      quizzes: [
        { id: 1, title: 'Quiz 1', questions: [{ id: 1 }] },
        { id: 2, title: 'Quiz 2', questions: [{ id: 2 }, { id: 3 }] },
      ],
    });
    jest.spyOn(prisma.submission as any, 'findFirst')
      .mockResolvedValueOnce({ score: 1 })
      .mockResolvedValueOnce({ score: 2 });

    const result = await service.getSubcategoryProgress(7, 'ABC123');

    expect(result.isFullyCompleted).toBe(true);
    expect(result.completedQuizzes).toBe(2);
    expect(result.quizResults[0].isComplete).toBe(true);
    expect(result.quizResults[1].isComplete).toBe(true);
  });

  it('should store earned points per submission instead of mutating the participant total score', async () => {
    jest.spyOn(prisma.participant as any, 'findUnique').mockResolvedValue({ id: 1, code: 'ABC123', name: 'Ali' });
    jest.spyOn(prisma.quiz as any, 'findUnique').mockResolvedValue({
      id: 10,
      isActive: true,
      points: 30,
      questions: [{ correctAnswer: 'A' }, { correctAnswer: 'B' }, { correctAnswer: 'C' }],
      subcategory: { points: 15 },
    });
    const createSpy = jest.spyOn(prisma.submission as any, 'create').mockResolvedValue({ id: 99 });
    jest.spyOn(prisma.participant as any, 'update').mockResolvedValue({ id: 1 });
    jest.spyOn(prisma as any, '$transaction').mockImplementation(async (operations: any[]) => {
      const [submission] = await Promise.all(operations.map((operation) => operation));
      return [submission, { id: 1 }];
    });

    await service.submitQuiz({
      quizId: 10,
      participantCode: 'ABC123',
      answers: ['A', 'B', 'Z'],
    } as any);

    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ earnedPoints: 20 }),
    }));
    expect(prisma.participant.update).not.toHaveBeenCalled();
  });
});
