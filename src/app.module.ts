import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitHubRankingModule } from './github-ranking/github-ranking.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GitHubRankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
