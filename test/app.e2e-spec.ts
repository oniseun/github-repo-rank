import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LanguageEnum } from './../src/github-ranking/enums/language.enum';

describe('GitHubRanking API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 400 when input validation fails (future date)', async () => {
    const invalidParams = {
      date: '2025-01-01', // Future date
      language: LanguageEnum.TypeScript,
      limit: 10,
    };

    const response = await request(app.getHttpServer())
      .get('/github-ranking')
      .query(invalidParams)
      .expect(400);

    expect(response.body.message).toContain('Date must not be in the future');
  });

  it('should return 400 when input validation fails (out of range limit)', async () => {
    const invalidParams = {
      date: '2024-01-01',
      language: LanguageEnum.TypeScript,
      limit: 500, // Out of range
    };

    const response = await request(app.getHttpServer())
      .get('/github-ranking')
      .query(invalidParams)
      .expect(400);

    expect(response.body.message).toContain(
      'limit must not be greater than 300',
    );
  });

  it('should return 400 when input validation fails (invalid language)', async () => {
    const invalidParams = {
      date: '2024-01-01',
      language: 'InvalidLanguage', // Invalid enum value
      limit: 10,
    };

    const validEnumValues = Object.values(LanguageEnum).join(', ');

    const response = await request(app.getHttpServer())
      .get('/github-ranking')
      .query(invalidParams)
      .expect(400);

    expect(response.body.message).toContain(
      `language must be one of the following values: ${validEnumValues}`,
    );
  });

  it('should return data with expected properties', async () => {
    const validParams = {
      date: '2024-01-01',
      limit: 1,
    };

    const response = await request(app.getHttpServer())
      .get('/github-ranking')
      .query(validParams)
      .expect(200);

    const result = response.body[0];

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('repoName');
    expect(result).toHaveProperty('stars');
    expect(result).toHaveProperty('forks');
    expect(result).toHaveProperty('language');
    expect(result).toHaveProperty('repoUrl');
    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('lastCommit');
    expect(result).toHaveProperty('description');
  });
});
