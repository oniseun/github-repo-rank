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
    let jsonData: GitHubRepo[];

    // Store TTL value in a constant
    const cacheTTL = this.configService.get<number>('CACHE_TTL_SECONDS', 3600);

    // Step 1: Check if the data for the given date exists in Redis cache
    const cachedData = await this.cacheManager.get<GitHubRepo[]>(cacheKey);

    if (cachedData) {
      // Step 2: If exists, store the value in jsonData
      jsonData = cachedData;
    } else {
      // Step 3: If not exist, fetch the CSV data, convert to JSON, and store in Redis
      const baseUrl = this.configService.get<string>('GITHUB_RANKING_BASE_URL');
      const url = `${baseUrl}/github-ranking-${date}.csv`;

      try {
        const response = await firstValueFrom(this.httpService.get(url)); // Making an HTTP GET request
        jsonData = await csv().fromString(response.data);

        // Store the JSON data in Redis with the specified expiration time (TTL as a number)
        await this.cacheManager.set(cacheKey, jsonData, cacheTTL);
      } catch (error) {
        throw new HttpException(
          'Error fetching or parsing data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // Step 4: Filter by language if specified
    if (language) {
      jsonData = jsonData.filter(
        (repo: GitHubRepo) => repo.language === language,
      );
    }

    // Step 5: Limit the response to the specified limit or default
    const limitedData = jsonData.slice(0, limit);

    return limitedData;
  }
}
