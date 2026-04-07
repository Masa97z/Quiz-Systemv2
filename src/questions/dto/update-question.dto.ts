// src/questions/dto/update-question.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

// هذا يسمح بتحديث حقل واحد أو عدة حقول دون الحاجة لإرسال كل بيانات السؤال
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) { }