import {
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  Min,
  IsOptional,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { LanguageEnum } from '../enums/language.enum';
import { isBefore, parseISO } from 'date-fns';

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
class IsNotFutureDate implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    return isBefore(parseISO(date), new Date());
  }

  defaultMessage(args: ValidationArguments) {
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
    example: 20,
    description:
      'Limit the number of results returned. Must be between 1 and 300.',
    default: 20,
  })
  @Type(() => Number)
  @Transform(({ value }) => value ?? 20)
  limit?: number = 20;
}
