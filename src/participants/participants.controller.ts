// src/participants/participants.controller.ts
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query, Patch } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('api/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) { }

  // POST: api/participants -> إضافة متسابق
  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantsService.create(createParticipantDto);
  }

  // GET: api/participants -> جلب الكل
  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  // GET: api/participants/login -> للتحقق من الدخول للمسابقة
  @Get('login')
  login(
    @Query('code') code: string,
    @Query('secretCode') secretCode: string,
  ) {
    return this.participantsService.validateParticipant(code, secretCode);
  }

  // PATCH: api/participants/5 -> لتعديل بيانات متسابق
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: { name?: string }) {
    return this.participantsService.updateParticipant(id, updateData);
  }

  // DELETE: api/participants/5 -> حذف متسابق
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.participantsService.remove(id);
  }
}