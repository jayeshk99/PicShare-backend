import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreateImageDto } from './dto/share-post.dto';
import { AddFavouriteDto } from './dto/add-favourite.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get('all')
  async login() {
    return await this.postService.getAll();
  }

  @Post('share')
  async sharePost(@Body() sharePostDto: CreateImageDto) {
    return await this.postService.create(sharePostDto);
  }
  @Get('favourites/:userId')
  async getFavouritePosts(@Param('userId') userId: string) {
    return await this.postService.getFavourite(userId);
  }
  @Post('favourites/add')
  async addFavourite(@Body() addFavouriteDto: AddFavouriteDto) {
    return await this.postService.addToFavourite(addFavouriteDto);
  }
  @Delete('favourites/:favouriteId')
  async deleteFavouritePost(@Param('favouriteId') favouriteId: string) {
    return await this.postService.deleteFavourite(favouriteId);
  }
}
