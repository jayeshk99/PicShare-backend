import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('login', () => {
    it('should return user data when login is successful', async () => {
      const userName = 'testuser';
      const mockUser = { userId: '123', userName };
      const loginDto: LoginUserDto = { userName };

      jest.spyOn(userService, 'login').mockResolvedValue({
        statusCode: HttpStatus.OK,
        data: mockUser,
      });

      const result = await userController.login(loginDto);

      expect(userService.login).toHaveBeenCalledWith(userName);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: mockUser,
      });
    });

    it('should throw a NotFoundException when user is not found', async () => {
      const userName = 'nonexistentuser';
      const loginDto: LoginUserDto = { userName };

      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new NotFoundException());

      await expect(userController.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a HttpException for general errors', async () => {
      const userName = 'erroruser';
      const loginDto: LoginUserDto = { userName };

      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(
          new HttpException('Error occurred', HttpStatus.INTERNAL_SERVER_ERROR),
        );

      await expect(userController.login(loginDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
