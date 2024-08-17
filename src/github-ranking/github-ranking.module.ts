import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GitHubRankingService } from './github-ranking.service';
import { GitHubRankingController } from './github-ranking.controller';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as string,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: configService.get<number>('CACHE_TTL_SECONDS', 3600),
      }),
    }),
  ],
  controllers: [GitHubRankingController],
  providers: [GitHubRankingService],
})
export class GitHubRankingModule {}
