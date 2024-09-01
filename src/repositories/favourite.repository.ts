import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouriteEntity } from 'src/entities/favourite.entity';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class FavouriteRepository extends BaseRepository<
  FavouriteEntity,
  string
> {
  constructor(
    @InjectRepository(FavouriteEntity)
    readonly favouriteRepository: Repository<FavouriteEntity>,
  ) {
    super(favouriteRepository);
  }
}
