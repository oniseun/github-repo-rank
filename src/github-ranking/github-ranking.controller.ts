import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GitHubRankingService } from './github-ranking.service';
import { GetGitHubRankingDto } from './dtos/get-github-ranking.dto';
import { GitHubRepoDto } from './dtos/github-repo.dto';
import { GitHubRepo } from './interfaces/github-repo.interface';

@ApiTags('GitHub Ranking')
@Controller('github-ranking')
export class GitHubRankingController {
  constructor(private readonly gitHubRankingService: GitHubRankingService) {}

  @Get()
  @ApiOperation({ summary: 'Get GitHub top repositories' })
  @ApiQuery({ type: GetGitHubRankingDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Successful response with GitHub repository rankings',
    type: [GitHubRepoDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, such as future date or out-of-range limit',
    type: BadRequestException,
  })
  async getGitHubRanking(
    @Query() params: GetGitHubRankingDto,
  ): Promise<GitHubRepoDto[]> {
    try {
      const repos: GitHubRepo[] =
        await this.gitHubRankingService.getGitHubRanking(params);

      return repos.map(GitHubRepoDto.fromInterface);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
