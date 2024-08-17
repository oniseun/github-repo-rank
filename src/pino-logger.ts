import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            messageFormat: '{method} {url} {statusCode} {responseTime}ms',
          },
        },
      },
    }),
  ],
})
export class PinoLoggerModule {}
