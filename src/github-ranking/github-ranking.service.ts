import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GitHubRepo } from './interfaces/github-repo.interface';
import { GetGitHubRankingDto } from './dtos/get-github-ranking.dto';
import * as csv from 'csvtojson';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GitHubRankingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getGitHubRanking(params: GetGitHubRankingDto): Promise<GitHubRepo[]> {
    const { date, language, limit } = params;
    const cacheKey = `github-ranking-${date}`;
    const cacheTTL = this.configService.get<number>('CACHE_TTL_SECONDS', 3600);

    let jsonData: GitHubRepo[] = await this.cacheManager.get<GitHubRepo[]>(
      cacheKey,
    );
    if (!jsonData) {
      const baseUrl = this.configService.get<string>('GITHUB_RANKING_BASE_URL');
      const url = `${baseUrl}/github-ranking-${date}.csv`;

      try {
        const response = await firstValueFrom(this.httpService.get(url));
        jsonData = await csv().fromString(response.data);
        await this.cacheManager.set(cacheKey, jsonData, cacheTTL);
      } catch (error) {
        throw new HttpException(
          'Error fetching or parsing data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    if (language) {
      jsonData = jsonData.filter(
        (repo: GitHubRepo) => repo.language === language,
      );
    }

    const limitedData = jsonData.slice(0, limit);

    return limitedData;
  }
}
