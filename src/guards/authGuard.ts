import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/skip-auth.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { CustomRequest } from 'src/types/request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request: CustomRequest = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    console.log('authHeader:', authHeader);

    const token = authHeader.split(' ')[1];
    console.log('token:', token);
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    const user = await this.userRepository.findOneById(token);
    request.user = user;
    console.log('user:', user);
    return true;
  }
}
