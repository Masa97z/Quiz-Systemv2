// src/participants/participants.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) { }

  // 1. إضافة متسابق جديد مع التحقق من عدم تكرار الكود
  async create(createParticipantDto: CreateParticipantDto) {
    const existing = await this.prisma.participant.findUnique({
      where: { code: createParticipantDto.code },
    });

    if (existing) {
      throw new ConflictException('هذا الكود مستخدم بالفعل، يرجى التوليد مرة أخرى');
    }

    return this.prisma.participant.create({
      data: createParticipantDto,
    });
  }

  // 2. جلب قائمة المتسابقين (للإدارة)
  findAll() {
    return this.prisma.participant.findMany({
      include: {
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { id: 'desc' },
    });
  }

  // تحديث بيانات المتسابق (مثل الاسم)
  updateParticipant(id: number, data: { name?: string }) {
    return this.prisma.participant.update({
      where: { id },
      data: { name: data.name },
    });
  }

  // 3. التحقق من بيانات الدخول (الاسم والكود والرمز السري)
  async validateParticipant(code: string, secretCode: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { code },
    });

    if (!participant || participant.secretCode !== secretCode) {
      throw new NotFoundException('بيانات الدخول غير صحيحة');
    }

    return participant;
  }

  // 4. حذف متسابق
  remove(id: number) {
    return this.prisma.participant.delete({
      where: { id },
    });
  }
}