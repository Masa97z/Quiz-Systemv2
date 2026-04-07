// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/dashboard')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getStats() {
    return this.appService.getDashboardStats();
  }
}