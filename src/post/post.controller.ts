import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreateImageDto } from './dto/share-post.dto';
import { AddFavouriteDto } from './dto/add-favourite.dto';
import { AuthGuard } from 'src/guards/authGuard';
import { CustomRequest } from 'src/types/express';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('all')
  @SkipAuth()
  async login() {
    return await this.postService.getAll();
  }

  @Post('share')
  async sharePost(
    @Body() sharePostDto: CreateImageDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;
    console.log('user data ', req.user);
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
