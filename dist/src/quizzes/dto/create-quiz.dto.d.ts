export declare class CreateQuestionDto {
    text: string;
    type: string;
    options?: string;
    correctAnswer?: string;
}
export declare class CreateQuizDto {
    title: string;
    questions: CreateQuestionDto[];
}
