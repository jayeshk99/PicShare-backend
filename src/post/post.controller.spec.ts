import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreateImageDto } from './dto/share-post.dto';
import { AddFavouriteDto } from './dto/add-favourite.dto';
import { CustomRequest } from '../types/request';
import { AuthGuard } from '../guards/authGuard';
import { UserRepository } from '../repositories/user.repository';

describe('PostController', () => {
  let postController: PostController;
  let postService: Partial<PostService>;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    postService = {
      getAll: jest.fn().mockResolvedValue(['post1', 'post2']),
      create: jest.fn().mockResolvedValue({ id: '1', imageUrl: 'image.jpg' }),
      getFavourite: jest.fn().mockResolvedValue(['favPost1', 'favPost2']),
      addToFavourite: jest.fn().mockResolvedValue({
        statusCode: 201,
        data: 'Favourite added successfully',
      }),
      deleteFavourite: jest.fn().mockResolvedValue({
        statusCode: 200,
        message: 'Favourite pic deleted successfully',
      }),
    };

    userRepository = {
      findOneById: jest
        .fn()
        .mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: postService,
        },
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const result = await postController.getAllPosts();
      expect(postService.getAll).toHaveBeenCalled();
      expect(result).toEqual(['post1', 'post2']);
    });
  });

  describe('sharePost', () => {
    it('should share a post and return the created post', async () => {
      const sharePostDto: CreateImageDto = {
        imageUrl: 'image.jpg',
        title: 'test',
      };
      const req = { user: { id: 'user123' } } as CustomRequest;

      const result = await postController.sharePost(sharePostDto, req);

      expect(postService.create).toHaveBeenCalledWith({
        ...sharePostDto,
        userId: 'user123',
      });
      expect(result).toEqual({ id: '1', imageUrl: 'image.jpg' });
    });
  });

  describe('getFavouritePosts', () => {
    it('should return favourite posts of the user', async () => {
      const req = { user: { id: 'user123' } } as CustomRequest;

      const result = await postController.getFavouritePosts(req);

      expect(postService.getFavourite).toHaveBeenCalledWith('user123');
      expect(result).toEqual(['favPost1', 'favPost2']);
    });
  });

  describe('addFavourite', () => {
    it('should add a post to favourites and return success message', async () => {
      const addFavouriteDto: AddFavouriteDto = { postId: 'post123' };
      const req = { user: { id: 'user123' } } as CustomRequest;

      const result = await postController.addFavourite(addFavouriteDto, req);

      expect(postService.addToFavourite).toHaveBeenCalledWith({
        ...addFavouriteDto,
        userId: 'user123',
      });
      expect(result).toEqual({
        statusCode: 201,
        data: 'Favourite added successfully',
      });
    });
  });

  describe('deleteFavouritePost', () => {
    it('should delete a favourite post and return success message', async () => {
      const favouriteId = 'favPost123';

      const result = await postController.deleteFavouritePost(favouriteId);

      expect(postService.deleteFavourite).toHaveBeenCalledWith(favouriteId);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Favourite pic deleted successfully',
      });
    });
  });
});
