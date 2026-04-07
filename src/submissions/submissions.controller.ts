// src/submissions/submissions.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  // POST: api/submissions -> لإرسال إجابات مسابقة
  @Post()
  submit(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.submitQuiz(createSubmissionDto);
  }

  // GET: api/submissions/leaderboard -> لجلب لوحة الشرف
  @Get('leaderboard')
  getLeaderboard() {
    return this.submissionsService.getLeaderboard();
  }
}