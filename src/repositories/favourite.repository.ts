import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouriteEntity } from 'src/entities/favourite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavouriteRepository {
  constructor(
    @InjectRepository(FavouriteEntity)
    private readonly favouriteRepository: Repository<FavouriteEntity>,
  ) {}
}
