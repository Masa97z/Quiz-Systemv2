// src/submissions/dto/create-submission.dto.ts
export class CreateSubmissionDto {
    quizId: number;
    participantCode: string; // نرسل كود المتسابق لأنه أسهل للواجهة الأمامية
    answers: string[];       // مصفوفة تحتوي على إجابات المتسابق بالترتيب
}