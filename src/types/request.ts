import { Request } from 'express';
import { UserEntity } from 'src/entities/user.entity';

export interface CustomRequest extends Request {
  user?: UserEntity;
}
