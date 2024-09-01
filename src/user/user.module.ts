import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RepositoriesModule } from 'src/repositories/repository.module';
import { UserController } from './user.controller';
import { UserEntity } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
