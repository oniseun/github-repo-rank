import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GitHubRankingService } from './github-ranking.service';
import { GitHubRankingController } from './github-ranking.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [GitHubRankingController],
  providers: [GitHubRankingService],
})
export class GitHubRankingModule {}
