import { Injectable } from '@nestjs/common';
import { ConfigService as configService } from '@nestjs/config';
@Injectable()
export class ConfigService {
  constructor(private readonly configService: configService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDatabasePort(): number {
    return this.configService.get<number>('DB_PORT');
  }
  getDatabaseUser(): string {
    return this.configService.get<string>('DB_USER');
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('DB_USER_PWD');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DB_NAME');
  }
}
