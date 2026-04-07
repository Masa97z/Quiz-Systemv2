import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // يجعل هذا الموديل متاحاً في كل المشروع دون الحاجة لاستيراده كل مرة
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }