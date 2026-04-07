// src/participants/dto/create-participant.dto.ts
export class CreateParticipantDto {
    name?: string;
    code: string;       // الكود المكون من 6 أرقام
    secretCode: string; // الرمز السري المكون من 6 أرقام
}