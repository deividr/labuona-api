import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import apiConfig from './config/api.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [apiConfig], isGlobal: true }),
    AuthModule,
  ],
})
export class AppModule {}
