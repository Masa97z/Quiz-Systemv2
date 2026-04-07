import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { ParticipantsModule } from './participants/participants.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [PrismaModule, QuizzesModule, QuestionsModule, ParticipantsModule, SubmissionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
