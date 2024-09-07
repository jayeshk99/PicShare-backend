import { HttpStatus, NotFoundException } from '@nestjs/common';
import { FavouriteRepository } from '../repositories/favourite.repository';
import { PostRepository } from '../repositories/post.repository';
import { PostService } from './post.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Partial<PostRepository>;
  let favouriteRepository: Partial<FavouriteRepository>;

  beforeEach(async () => {
    postRepository = {
      findWithRelations: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOneById: jest.fn(),
      findAndCount: jest.fn(),
    };
    favouriteRepository = {
      findWithRelations: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOneById: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: postRepository,
        },
        {
          provide: FavouriteRepository,
          useValue: favouriteRepository,
        },
      ],
    }).compile();
    postService = module.get<PostService>(PostService);
  });

  //  getAll method ------------------
  it('getAll => should return paginated posts with total count', async () => {
    const posts = [
      {
        id: 'abc',
        imageUrl: 'https://image.com',
        title: 'title',
        createdBy: 'bcd',
        user: {
          id: 'ab',
          userName: 'jayesh',
          createdAt: new Date('2023-09-01T12:00:00'),
          updatedAt: new Date('2023-09-01T12:00:00'),
        },
        createdAt: new Date('2023-09-01T12:00:00'),
        updatedAt: new Date('2023-09-01T12:00:00'),
      },
    ];
    const totalCount = 1;

    (postRepository.findAndCount as jest.Mock).mockResolvedValue([
      posts,
      totalCount,
    ]);

    const page = 1;
    const limit = 10;
    const result = await postService.getAll(page, limit);

    expect(result.data).toEqual(posts);
    expect(result.data.length).toBe(totalCount);
    expect(result.statusCode).toBe(HttpStatus.OK);
  });

  it('getAll => should throw an error if repository throws an error', async () => {
    jest
      .spyOn(postRepository, 'findAndCount')
      .mockRejectedValue(new Error('Repository Error'));

    const page = 1;
    const limit = 10;

    await expect(postService.getAll(page, limit)).rejects.toThrow(
      'Repository Error',
    );

    expect(postRepository.findAndCount).toHaveBeenCalledWith({
      relations: ['user', 'favourites'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  });

  // create method -----------------

  it('should create and return a newly created post', async () => {
    const post = {
      imageUrl: 'https://image.com',
      title: 'image1',
      userId: 'usera',
    };
    const mockPost = {
      imageUrl: 'https://image.com',
      title: 'image1',
      createdBy: 'usera',
    };

    (postRepository.create as jest.Mock).mockReturnValue({
      imageUrl: 'https://image.com',
      title: 'image1',
      createdBy: 'usera',
    });
    (postRepository.save as jest.Mock).mockResolvedValue(mockPost);

    const result = await postService.create(post);

    expect(postRepository.create).toHaveBeenCalledWith(mockPost);
    expect(postRepository.save).toHaveBeenCalledWith(mockPost);
    expect(result).toEqual({
      statusCode: HttpStatus.CREATED,
      data: mockPost,
    });
  });

  it('should throw an error if post creation fails', async () => {
    const post = {
      imageUrl: 'https://image.com',
      title: 'image1',
      userId: 'usera',
    };

    (postRepository.create as jest.Mock).mockReturnValue({
      imageUrl: 'https://image.com',
      title: 'image1',
      createdBy: 'usera',
    });
    (postRepository.save as jest.Mock).mockRejectedValue(
      new Error('Failed to save post'),
    );

    await expect(postService.create(post)).rejects.toThrow(
      'Failed to save post',
    );

    expect(postRepository.create).toHaveBeenCalledWith({
      imageUrl: 'https://image.com',
      title: 'image1',
      createdBy: 'usera',
    });

    expect(postRepository.save).toHaveBeenCalled();
  });

  // getFavourites --------------

  it('should return favourite posts for the given user ID', async () => {
    const userId = 'user1';
    const favouritePosts = [
      {
        id: 'fav1',
        post: {
          id: 'post1',
          title: 'Post Title 1',
          imageUrl: 'https://image.com/post1.jpg',
          createdBy: 'user1',
          createdAt: new Date('2023-09-01T12:00:00'),
          updatedAt: new Date('2023-09-01T12:00:00'),
          user: {
            id: 'user1',
            userName: 'jayesh',
            createdAt: new Date('2023-09-01T12:00:00'),
            updatedAt: new Date('2023-09-01T12:00:00'),
          },
        },
        user: {
          id: 'user1',
          userName: 'jayesh',
          createdAt: new Date('2023-09-01T12:00:00'),
          updatedAt: new Date('2023-09-01T12:00:00'),
        },
        createdAt: new Date('2023-09-01T12:00:00'),
        updatedAt: new Date('2023-09-01T12:00:00'),
      },
    ];

    (favouriteRepository.findWithRelations as jest.Mock).mockResolvedValue(
      favouritePosts,
    );

    const result = await postService.getFavourite(userId);

    expect(favouriteRepository.findWithRelations).toHaveBeenCalledWith({
      where: { userId },
      relations: ['post', 'user'],
      order: { createdAt: 'DESC' },
    });
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.data).toEqual(favouritePosts);
  });

  it('should throw an error if the repository fails to retrieve favourite posts', async () => {
    const userId = 'user1';

    (favouriteRepository.findWithRelations as jest.Mock).mockRejectedValue(
      new Error('Repository Error'),
    );

    await expect(postService.getFavourite(userId)).rejects.toThrow(
      'Repository Error',
    );

    expect(favouriteRepository.findWithRelations).toHaveBeenCalledWith({
      where: { userId },
      relations: ['post', 'user'],
      order: { createdAt: 'DESC' },
    });
  });

  // addToFavourites -------------------

  it('should add a post to favourites and return a success message', async () => {
    const postId = 'post1';
    const userId = 'user1';
    const addFavouriteData = { postId, userId };

    const post = {
      id: postId,
      imageUrl: 'https://image.com/post1.jpg',
      title: 'Post Title 1',
      createdBy: 'user1',
      createdAt: new Date('2023-09-01T12:00:00'),
      updatedAt: new Date('2023-09-01T12:00:00'),
      user: {
        id: 'user1',
        userName: 'jayesh',
        createdAt: new Date('2023-09-01T12:00:00'),
        updatedAt: new Date('2023-09-01T12:00:00'),
      },
    };

    const favourite = {
      id: 'fav1',
      postId,
      userId,
      createdAt: new Date('2023-09-01T12:00:00'),
      updatedAt: new Date('2023-09-01T12:00:00'),
    };

    (postRepository.findOneById as jest.Mock).mockResolvedValue(post);
    (favouriteRepository.create as jest.Mock).mockReturnValue(favourite);
    (favouriteRepository.save as jest.Mock).mockResolvedValue(favourite);

    const result = await postService.addToFavourite(addFavouriteData);

    expect(postRepository.findOneById).toHaveBeenCalledWith(postId);
    expect(favouriteRepository.create).toHaveBeenCalledWith({ postId, userId });
    expect(favouriteRepository.save).toHaveBeenCalledWith(favourite);
    expect(result).toEqual({
      statusCode: HttpStatus.CREATED,
      data: 'Favourite added succesfully',
    });
  });

  it('should throw a NotFoundException if the post does not exist', async () => {
    const postId = 'nonexistentPost';
    const userId = 'user1';
    const addFavouriteData = { postId, userId };

    (postRepository.findOneById as jest.Mock).mockResolvedValue(null);

    await expect(postService.addToFavourite(addFavouriteData)).rejects.toThrow(
      new NotFoundException(`PostID ${postId} does not exist`),
    );

    expect(postRepository.findOneById).toHaveBeenCalledWith(postId);
    expect(favouriteRepository.create).not.toHaveBeenCalled();
    expect(favouriteRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if there is an issue while creating or saving a favourite', async () => {
    const postId = 'post1';
    const userId = 'user1';
    const addFavouriteData = { postId, userId };

    const post = {
      id: postId,
      imageUrl: 'https://image.com/post1.jpg',
      title: 'Post Title 1',
      createdBy: 'user1',
      createdAt: new Date('2023-09-01T12:00:00'),
      updatedAt: new Date('2023-09-01T12:00:00'),
      user: {
        id: 'user1',
        userName: 'jayesh',
        createdAt: new Date('2023-09-01T12:00:00'),
        updatedAt: new Date('2023-09-01T12:00:00'),
      },
    };

    (postRepository.findOneById as jest.Mock).mockResolvedValue(post);
    (favouriteRepository.create as jest.Mock).mockReturnValue({
      postId,
      userId,
    });
    (favouriteRepository.save as jest.Mock).mockRejectedValue(
      new Error('Save Error'),
    );

    await expect(postService.addToFavourite(addFavouriteData)).rejects.toThrow(
      'Save Error',
    );

    expect(postRepository.findOneById).toHaveBeenCalledWith(postId);
    expect(favouriteRepository.create).toHaveBeenCalledWith({ postId, userId });
    expect(favouriteRepository.save).toHaveBeenCalled();
  });

  // deleteFavourite  -------------
  it('should delete a favourite and return a success message', async () => {
    const favouritePostId = 'fav1';

    const favouriteData = {
      id: favouritePostId,
      postId: 'post1',
      userId: 'user1',
      createdAt: new Date('2023-09-01T12:00:00'),
      updatedAt: new Date('2023-09-01T12:00:00'),
    };

    (favouriteRepository.findOneById as jest.Mock).mockResolvedValue(
      favouriteData,
    );
    (favouriteRepository.remove as jest.Mock).mockResolvedValue(favouriteData);

    const result = await postService.deleteFavourite(favouritePostId);

    expect(favouriteRepository.findOneById).toHaveBeenCalledWith(
      favouritePostId,
    );
    expect(favouriteRepository.remove).toHaveBeenCalledWith(favouriteData);
    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Favourite pic deleted succesfully',
    });
  });

  it('should throw a NotFoundException if the favourite post does not exist', async () => {
    const favouritePostId = 'nonexistentFav';

    (favouriteRepository.findOneById as jest.Mock).mockResolvedValue(null);

    await expect(postService.deleteFavourite(favouritePostId)).rejects.toThrow(
      new NotFoundException('Favourite post Id does not exist'),
    );

    expect(favouriteRepository.findOneById).toHaveBeenCalledWith(
      favouritePostId,
    );
    expect(favouriteRepository.remove).not.toHaveBeenCalled();
  });

  it('should throw an error if there is an issue while removing a favourite', async () => {
    const favouritePostId = 'fav1';

    const favouriteData = {
      id: favouritePostId,
      postId: 'post1',
      userId: 'user1',
      createdAt: new Date('2023-09-01T12:00:00'),
      updatedAt: new Date('2023-09-01T12:00:00'),
    };

    (favouriteRepository.findOneById as jest.Mock).mockResolvedValue(
      favouriteData,
    );
    (favouriteRepository.remove as jest.Mock).mockRejectedValue(
      new Error('Remove Error'),
    );

    await expect(postService.deleteFavourite(favouritePostId)).rejects.toThrow(
      'Remove Error',
    );

    expect(favouriteRepository.findOneById).toHaveBeenCalledWith(
      favouritePostId,
    );
    expect(favouriteRepository.remove).toHaveBeenCalledWith(favouriteData);
  });
});
