import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitHubRankingModule } from './github-ranking/github-ranking.module';
import { PinoLoggerModule } from './pino-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GitHubRankingModule,
    PinoLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
