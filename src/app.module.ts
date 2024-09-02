import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RepositoriesModule } from './repositories/repository.module';
import { UserController } from './user/user.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [DatabaseModule, RepositoriesModule, UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
