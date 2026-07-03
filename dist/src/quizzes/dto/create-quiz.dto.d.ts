export declare class CreateQuestionDto {
    text: string;
    type: string;
    options?: string;
    correctAnswer?: string;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
}
export declare class CreateSubcategoryDto {
    categoryId: number | string;
    name: string;
    description?: string;
}
export declare class CreateQuizDto {
    title: string;
    subcategoryId: number | string;
    timeLimit?: number | string;
    questions: CreateQuestionDto[];
}
