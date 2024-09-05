import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRepository } from '../repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    userRepository = {
      findByCondition: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return existing user when userName is found', async () => {
    const mockUser = { id: '123', userName: 'testuser' };
    (userRepository.findByCondition as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.login('testuser');

    expect(userRepository.findByCondition).toHaveBeenCalledWith({
      where: { userName: 'testuser' },
    });
    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      data: { userId: '123', userName: 'testuser' },
    });
  });

  it('should create and return a new user when userName is not found', async () => {
    const mockUser = { id: '456', userName: 'newuser' };
    (userRepository.findByCondition as jest.Mock).mockResolvedValue(null);
    (userRepository.create as jest.Mock).mockReturnValue(mockUser);
    (userRepository.save as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.login('newuser');

    expect(userRepository.findByCondition).toHaveBeenCalledWith({
      where: { userName: 'newuser' },
    });
    expect(userRepository.create).toHaveBeenCalledWith({ userName: 'newuser' });
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      data: { userId: '456', userName: 'newuser' },
    });
  });

  it('should throw an error if something goes wrong', async () => {
    (userRepository.findByCondition as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(service.login('erroruser')).rejects.toThrow('Database error');
  });
});
