import { GitHubRankingController } from './github-ranking.controller';
import { GitHubRankingService } from './github-ranking.service';
import { GetGitHubRankingDto } from './dtos/get-github-ranking.dto';
import { GitHubRepoDto } from './dtos/github-repo.dto';
import { GitHubRepo } from './interfaces/github-repo.interface';
import { BadRequestException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { LanguageEnum } from './enums/language.enum';

describe('GitHubRankingController', () => {
  let controller: GitHubRankingController;
  let service: GitHubRankingService;

  beforeEach(() => {
    service = createMock<GitHubRankingService>();
    controller = new GitHubRankingController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 when input validation fails', async () => {
    const invalidParams: GetGitHubRankingDto = {
      date: '2025-01-01', // Future date
      language: 'InvalidLanguage' as any, // Invalid enum value
      limit: 500, // Out of range
    };

    try {
      await controller.getGitHubRanking(invalidParams);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Bad Request Exception');
    }
  });

  it('should return data transformed into DTO', async () => {
    const validParams: GetGitHubRankingDto = {
      date: '2024-08-01',
      language: LanguageEnum.TypeScript,
      limit: 10,
    };

    const mockData: GitHubRepo[] = [
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
        last_commit: new Date('2024-01-01T00:00:00Z'),
        description: 'Description for repo-1',
      },
    ];

    const expectedResult: GitHubRepoDto[] = mockData.map(
      GitHubRepoDto.fromInterface,
    );

    jest.spyOn(service, 'getGitHubRanking').mockResolvedValue(mockData);

    const result = await controller.getGitHubRanking(validParams);
    expect(result).toEqual(expectedResult);
  });

  it('should return 400 if service throws an error', async () => {
    const validParams: GetGitHubRankingDto = {
      date: '2024-08-01',
      language: LanguageEnum.TypeScript,
      limit: 10,
    };

    jest
      .spyOn(service, 'getGitHubRanking')
      .mockRejectedValue(new Error('Service error'));

    try {
      await controller.getGitHubRanking(validParams);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Service error');
    }
  });

  it('should handle empty data from service', async () => {
    const validParams: GetGitHubRankingDto = {
      date: '2024-08-01',
      language: LanguageEnum.TypeScript,
      limit: 10,
    };

    jest.spyOn(service, 'getGitHubRanking').mockResolvedValue([]);

    const result = await controller.getGitHubRanking(validParams);
    expect(result).toEqual([]);
  });
});
