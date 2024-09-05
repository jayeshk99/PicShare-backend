import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RepositoriesModule } from '../repositories/repository.module';
import { UserController } from './user.controller';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
