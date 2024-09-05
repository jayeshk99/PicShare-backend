import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { FavouriteRepository } from './favourite.repository';
import { UserEntity } from '../entities/user.entity';
import { FavouriteEntity } from '../entities/favourite.entity';
import { PostEntity } from '../entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PostEntity, FavouriteEntity]),
  ],
  providers: [UserRepository, PostRepository, FavouriteRepository],
  exports: [UserRepository, PostRepository, FavouriteRepository],
})
export class RepositoriesModule {}
