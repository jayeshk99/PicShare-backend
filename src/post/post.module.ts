import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repository.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
