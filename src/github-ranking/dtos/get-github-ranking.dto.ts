import {
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  Min,
  IsOptional,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LanguageEnum } from '../enums/language.enum';
import { isBefore, parseISO } from 'date-fns';

class IsNotFutureDate {
  validate(date: string) {
    return isBefore(parseISO(date), new Date());
  }

  defaultMessage() {
    return 'Date must not be in the future';
  }
}

export class GetGitHubRankingDto {
  @IsDateString()
  @Validate(IsNotFutureDate)
  @ApiProperty({
    example: '2024-08-10',
    description:
      'The date for which you want to retrieve the GitHub rankings. It must not be a future date.',
  })
  date: string;

  @IsEnum(LanguageEnum)
  @IsOptional()
  @ApiProperty({
    enum: LanguageEnum,
    example: 'TypeScript',
    required: false,
    description:
      'Filter the rankings by a specific programming language. This field is optional.',
  })
  language?: LanguageEnum;

  @IsInt()
  @Min(1)
  @Max(300)
  @ApiProperty({
    example: 10,
    description:
      'Limit the number of results returned. Must be between 1 and 300.',
  })
  @Type(() => Number)
  limit = 300;
}
