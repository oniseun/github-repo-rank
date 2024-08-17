import { ApiProperty } from '@nestjs/swagger';
import { GitHubRepo } from '../interfaces/github-repo.interface';

export class GitHubRepoDto {
  @ApiProperty({
    example: 1,
    description: 'The rank of the repository based on stars.',
  })
  rank: number;

  @ApiProperty({
    example: 'top-100-stars',
    description:
      'The category of the ranking, typically indicating the type of list.',
  })
  item: string;

  @ApiProperty({
    example: 'freeCodeCamp',
    description: 'The name of the repository.',
  })
  repoName: string;

  @ApiProperty({
    example: 398312,
    description: 'The number of stars the repository has received.',
  })
  stars: number;

  @ApiProperty({
    example: 36688,
    description: 'The number of forks of the repository.',
  })
  forks: number;

  @ApiProperty({
    example: 'TypeScript',
    description: 'The primary programming language used in the repository.',
  })
  language: string;

  @ApiProperty({
    example: 'https://github.com/freeCodeCamp/freeCodeCamp',
    description: 'The URL of the repository on GitHub.',
  })
  repoUrl: string;

  @ApiProperty({
    example: 'freeCodeCamp',
    description: 'The GitHub username of the repository owner.',
  })
  username: string;

  @ApiProperty({
    example: 188,
    description: 'The number of open issues in the repository.',
  })
  issues: number;

  @ApiProperty({
    example: '2024-08-09T21:20:48Z',
    description: 'The timestamp of the last commit made to the repository.',
  })
  lastCommit: Date;

  @ApiProperty({
    example: 'Learn to code for free.',
    description: 'A short description of the repository.',
  })
  description: string;

  // Static method to transform GitHubRepo interface into GitHubRepoDto
  static fromInterface(repo: GitHubRepo): GitHubRepoDto {
    const dto = new GitHubRepoDto();
    dto.rank = repo.rank;
    dto.item = repo.item;
    dto.repoName = repo.repo_name; // Convert snake_case to camelCase
    dto.stars = repo.stars;
    dto.forks = repo.forks;
    dto.language = repo.language;
    dto.repoUrl = repo.repo_url; // Convert snake_case to camelCase
    dto.username = repo.username;
    dto.issues = repo.issues;
    dto.lastCommit = new Date(repo.last_commit); // Convert to Date object if needed
    dto.description = repo.description;
    return dto;
  }
}
