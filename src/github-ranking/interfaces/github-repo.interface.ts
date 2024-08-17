import { LanguageEnum } from '../enums/language.enum';

export interface GitHubRepo {
  rank: number;
  item: string;
  repo_name: string;
  stars: number;
  forks: number;
  language: LanguageEnum;
  repo_url: string;
  username: string;
  issues: number;
  last_commit: Date;
  description: string;
}
