// src/quizzes/quizzes.controller.ts
import { Controller, Get, Post, Put, Body, Param, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Controller('api/quizzes') // مسار الـ API سيكون: http://localhost:3000/api/quizzes
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) { }

  // POST: api/quizzes -> لإنشاء مسابقة
  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  // GET: api/quizzes -> لجلب كل المسابقات
  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  // GET: api/quizzes/code/123456 -> لجلب مسابقة بواسطة الكود
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.quizzesService.findByCode(code);
  }

  // GET: api/quizzes/5 -> لجلب تفاصيل مسابقة رقم 5
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.findOne(id);
  }

  // PUT: api/quizzes/5 -> لتعديل المسابقة
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateQuizDto: any) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  // DELETE: api/quizzes/5 -> لحذف مسابقة
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.remove(id);
  }

  // PATCH: api/quizzes/5/toggle-status -> وتغيير حالة المسابقة
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.toggleStatus(id);
  }

  // PATCH: api/quizzes/5/end -> إنهاء المسابقة
  @Patch(':id/end')
  endQuiz(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.endQuiz(id);
  }
}