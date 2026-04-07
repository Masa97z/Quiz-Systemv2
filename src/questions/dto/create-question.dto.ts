// src/questions/dto/create-question.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateQuestionDto {
    @IsInt()
    quizId: number; // يجب تحديد المسابقة التي ينتمي إليها السؤال

    @IsString()
    text: string;

    @IsString()
    type: string; // 'multiple' أو 'text'

    @IsOptional()
    @IsString()
    options?: string; // يتم إرسالها كـ JSON String

    @IsOptional()
    @IsString()
    correctAnswer?: string;
}