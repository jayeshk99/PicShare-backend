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

  it('getAll => should return all the posts', async () => {
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
    (postRepository.findWithRelations as jest.Mock).mockResolvedValue(posts);

    const result = await postService.getAll();

    expect(result.data).toEqual(posts);
    expect(result.statusCode).toBe(200);
  });

  it('should throw an error if repository throws an error', async () => {
    jest
      .spyOn(postRepository, 'findWithRelations')
      .mockRejectedValue(new Error('Repository Error'));

    await expect(postService.getAll()).rejects.toThrow('Repository Error');

    expect(postRepository.findWithRelations).toHaveBeenCalled();
  });
});
