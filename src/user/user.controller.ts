import {
  Body,
  Controller,
  HttpException,
  NotFoundException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    return await this.userService.login(userDto.userName);
  }
}
