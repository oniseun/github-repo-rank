import { GitHubRankingService } from './github-ranking.service';
import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { LanguageEnum } from './enums/language.enum';
import * as csv from 'csvtojson';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('GitHubRankingService', () => {
  let service: GitHubRankingService;
  let cacheManager: Cache;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockCsvData = `
    rank,item,repo_name,stars,forks,language,repo_url,username,issues,last_commit,description
    1,top-100-stars,repo-1,10001,501,TypeScript,https://github.com/repo-1,user1,1,2024-01-01T00:00:00Z,Description for repo-1
    2,top-100-stars,repo-2,10002,502,Python,https://github.com/repo-2,user2,2,2024-01-01T00:00:00Z,Description for repo-2
    3,top-100-stars,repo-3,10003,503,TypeScript,https://github.com/repo-3,user3,3,2024-01-01T00:00:00Z,Description for repo-3
    4,top-100-stars,repo-4,10004,504,Python,https://github.com/repo-4,user4,4,2024-01-01T00:00:00Z,Description for repo-4
    5,top-100-stars,repo-5,10005,505,TypeScript,https://github.com/repo-5,user5,5,2024-01-01T00:00:00Z,Description for repo-5
  `;

  const mockGitHubData = [
    {
      rank: 1,
      item: 'top-100-stars',
      repo_name: 'repo-1',
      stars: 10001,
      forks: 501,
      language: LanguageEnum.TypeScript,
      repo_url: 'https://github.com/repo-1',
      username: 'user1',
      issues: 1,
      last_commit: '2024-01-01T00:00:00Z',
      description: 'Description for repo-1',
    },
    {
      rank: 2,
      item: 'top-100-stars',
      repo_name: 'repo-2',
      stars: 10002,
      forks: 502,
      language: LanguageEnum.Python,
      repo_url: 'https://github.com/repo-2',
      username: 'user2',
      issues: 2,
      last_commit: '2024-01-01T00:00:00Z',
      description: 'Description for repo-2',
    },
  ];

  beforeEach(() => {
    cacheManager = createMock<Cache>();
    httpService = createMock<HttpService>();
    configService = createMock<ConfigService>();

    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'GITHUB_RANKING_BASE_URL') {
        return 'https://github.com/repo';
      }
      if (key === 'CACHE_TTL_SECONDS') {
        return 3600;
      }
    });

    service = new GitHubRankingService(
      httpService,
      configService,
      cacheManager,
    );
  });

  it('should handle cache miss and fetch data', async () => {
    const httpResponse: AxiosResponse = {
      data: mockCsvData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse;

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    const jsonData = await csv().fromString(mockCsvData);

    const result = await service.getGitHubRanking({
      date: '2024-01-01',
      language: null,
      limit: 10,
    });

    expect(cacheManager.get).toHaveBeenCalledWith('github-ranking-2024-01-01');
    expect(httpService.get).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith(
      'github-ranking-2024-01-01',
      jsonData,
      3600,
    );
    expect(result).toHaveLength(5);
  });

  it('should handle cache hit', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(mockGitHubData);
    const httpGetSpy = jest.spyOn(httpService, 'get');

    const result = await service.getGitHubRanking({
      date: '2024-01-01',
      language: null,
      limit: 10,
    });

    expect(cacheManager.get).toHaveBeenCalledWith('github-ranking-2024-01-01');
    expect(httpGetSpy).not.toHaveBeenCalled();
    expect(result).toEqual(mockGitHubData);
  });

  it('should get results by date', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(mockGitHubData);

    const result = await service.getGitHubRanking({
      date: '2024-01-01',
      language: null,
      limit: 10,
    });

    expect(result).toHaveLength(2);
    expect(result[0].repo_name).toBe('repo-1');
  });

  it('should filter results by language', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(mockGitHubData);

    const result = await service.getGitHubRanking({
      date: '2024-01-01',
      language: LanguageEnum.TypeScript,
      limit: 10,
    });

    expect(
      result.every((repo) => repo.language === LanguageEnum.TypeScript),
    ).toBe(true);
  });

  it('should limit results', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(mockGitHubData);

    const result = await service.getGitHubRanking({
      date: '2024-01-01',
      language: null,
      limit: 1,
    });

    expect(result).toHaveLength(1);
  });
});
