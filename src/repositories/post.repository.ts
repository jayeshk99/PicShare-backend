import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class PostRepository extends BaseRepository<PostEntity, string> {
  constructor(
    @InjectRepository(PostEntity)
    readonly postRepository: Repository<PostEntity>,
  ) {
    super(postRepository);
  }
  async findAndCount(options: FindManyOptions<PostEntity>) {
    return await this.postRepository.findAndCount(options);
  }
}
