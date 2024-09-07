import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreateImageDto } from './dto/share-post.dto';
import { AddFavouriteDto } from './dto/add-favourite.dto';
import { AuthGuard } from '../guards/authGuard';
import { CustomRequest } from '../types/request';
import { SkipAuth } from '../decorators/skip-auth.decorator';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @Get('all')
  @SkipAuth()
  async getAllPosts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.postService.getAll(pageNumber, limitNumber);
  }

  @Post('share')
  async sharePost(
    @Body() sharePostDto: CreateImageDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;
    return await this.postService.create({ ...sharePostDto, userId });
  }

  @Get('favourites')
  async getFavouritePosts(@Req() req: CustomRequest) {
    const userId = req.user.id;
    return await this.postService.getFavourite(userId);
  }

  @Post('favourites/add')
  async addFavourite(
    @Body() addFavouriteDto: AddFavouriteDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;
    return await this.postService.addToFavourite({
      ...addFavouriteDto,
      userId,
    });
  }

  @Delete('favourites/:favouriteId')
  async deleteFavouritePost(@Param('favouriteId') favouriteId: string) {
    return await this.postService.deleteFavourite(favouriteId);
  }
}
