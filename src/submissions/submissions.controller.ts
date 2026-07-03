// src/submissions/submissions.controller.ts
import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
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

  // GET: api/submissions/subcategories/5/progress/ABC123 -> اكتشاف إكمال التصنيف الفرعي
  @Get('subcategories/:id/progress/:participantCode')
  getSubcategoryProgress(
    @Param('id', ParseIntPipe) id: number,
    @Param('participantCode') participantCode: string,
  ) {
    return this.submissionsService.getSubcategoryProgress(id, participantCode);
  }

  // GET: api/submissions/leaderboard -> لجلب لوحة الشرف
  @Get('leaderboard')
  getLeaderboard() {
    return this.submissionsService.getLeaderboard();
  }
}