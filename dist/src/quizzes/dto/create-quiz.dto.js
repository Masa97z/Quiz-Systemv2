"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuizDto = exports.CreateSubcategoryDto = exports.CreateCategoryDto = exports.CreateQuestionDto = void 0;
class CreateQuestionDto {
    text;
    type;
    options;
    correctAnswer;
}
exports.CreateQuestionDto = CreateQuestionDto;
class CreateCategoryDto {
    name;
    description;
}
exports.CreateCategoryDto = CreateCategoryDto;
class CreateSubcategoryDto {
    categoryId;
    name;
    description;
    points;
}
exports.CreateSubcategoryDto = CreateSubcategoryDto;
class CreateQuizDto {
    title;
    subcategoryId;
    timeLimit;
    points;
    questions;
}
exports.CreateQuizDto = CreateQuizDto;
//# sourceMappingURL=create-quiz.dto.js.map