import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    // الاتصال التلقائي عند بدء التطبيق
    await this.$connect();
  }

  // في الإصدارات الحديثة، Prisma Client يقوم بالإغلاق تلقائياً بشكل ممتاز
  // ولكن إذا أردت الالتزام بـ OnModuleDestroy:
  async onModuleDestroy() {
    await this.$disconnect();
  }
}