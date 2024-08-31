import { Module } from '@nestjs/common';
import { ConfigModule as configModule } from '@nestjs/config';
import { ConfigService } from './config.service';
@Module({
  imports: [
    configModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
