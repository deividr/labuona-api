import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const API_PORT = configService.get<number>('api.port') as number;
  await app.listen(API_PORT);
}
bootstrap();
