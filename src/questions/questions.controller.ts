// src/questions/questions.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  // POST: api/questions -> لإضافة سؤال منفرد لمسابقة
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  // GET: api/questions/quiz/5 -> لجلب كل أسئلة المسابقة رقم 5
  @Get('quiz/:quizId')
  findByQuiz(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.questionsService.findByQuiz(quizId);
  }

  // GET: api/questions/10 -> لجلب تفاصيل السؤال رقم 10
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  // PATCH: api/questions/10 -> لتعديل السؤال رقم 10
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  // DELETE: api/questions/10 -> لحذف السؤال رقم 10
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}