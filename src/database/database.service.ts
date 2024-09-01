import { Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
import { UserEntity } from 'src/entities/user.entity';
import { PostEntity } from 'src/entities/post.entity';
import { FavouriteEntity } from 'src/entities/favourite.entity';
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
      entities: [UserEntity, PostEntity, FavouriteEntity],
      //   autoLoadEntities: true,
      synchronize: true,
      logging: false,
    };
  }
}
