// src/quizzes/dto/create-quiz.dto.ts

export class CreateQuestionDto {
    text: string;
    type: string; // 'multiple' أو 'text'
    options?: string; // سنقوم بتمرير مصفوفة الخيارات كـ JSON String (مثال: '["أ","ب","ج"]')
    correctAnswer?: string;
}

export class CreateQuizDto {
    title: string;
    questions: CreateQuestionDto[]; // مصفوفة من الأسئلة
}