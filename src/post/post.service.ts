import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FavouriteRepository } from '../repositories/favourite.repository';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import { IAddFavourite, ISharePost } from './interfaces';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    private readonly postRepository: PostRepository,
    private readonly favouriteRepository: FavouriteRepository,
  ) {}

  async getAll() {
    try {
      const posts = await this.postRepository.findWithRelations({
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: posts,
      };
    } catch (error) {
      this.logger.error(`Error in getting all posts: ${error}`);
      throw error;
    }
  }

  async create(data: ISharePost) {
    try {
      const { imageUrl, title, userId } = data;
      const postData = this.postRepository.create({
        imageUrl: imageUrl,
        createdBy: userId,
        title: title,
      });
      const newPost = await this.postRepository.save(postData);
      return { statusCode: HttpStatus.CREATED, data: newPost };
    } catch (error) {
      this.logger.error(`Error in creating post ${data}: ${error}`);
      throw error;
    }
  }

  async getFavourite(userId: string) {
    try {
      const favouritePosts = await this.favouriteRepository.findWithRelations({
        where: { userId },
        relations: ['post', 'user'],
        order: {
          createdAt: 'DESC',
        },
      });
      return { statusCode: HttpStatus.OK, data: favouritePosts };
    } catch (error) {
      this.logger.error(
        `Error in getting favourite posts for ${userId} : ${error}`,
      );
      throw error;
    }
  }
  async addToFavourite(data: IAddFavourite) {
    try {
      const { postId, userId } = data;
      const postData = await this.postRepository.findOneById(postId);
      if (!postData)
        throw new NotFoundException(`PostID ${postId} does not exist`);
      const favouriteData = this.favouriteRepository.create({ postId, userId });
      const favouriteResult =
        await this.favouriteRepository.save(favouriteData);
      return {
        statusCode: HttpStatus.CREATED,
        data: 'Favourite added succesfully',
      };
    } catch (error) {
      this.logger.error(
        `Error in adding favourite posts for ${data.userId} :  ${error}`,
      );
      throw error;
    }
  }
  async deleteFavourite(favouritePostId: string) {
    try {
      const favouriteData =
        await this.favouriteRepository.findOneById(favouritePostId);
      if (!favouriteData) {
        this.logger.error(
          `Favourite post id ${favouritePostId} does not exist`,
        );
        throw new NotFoundException(`Favourite post Id does not exist`);
      }
      const result = await this.favouriteRepository.remove(favouriteData);
      return {
        statusCode: HttpStatus.OK,
        message: 'Favourite pic deleted succesfully',
      };
    } catch (error) {
      this.logger.error(
        `Error in deleting favourite post ${favouritePostId} : ${error}`,
      );
      throw error;
    }
  }
}
