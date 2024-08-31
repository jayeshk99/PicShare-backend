import { Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.getDatabaseHost(),
      username: this.configService.getDatabaseUser(),
      password: this.configService.getDatabasePassword(),
      database: this.configService.getDatabaseName(),
      //   entities: [...EntityLists],
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    };
  }
}
