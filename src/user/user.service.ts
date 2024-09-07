import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async login(userName: string) {
    try {
      let userId: string;
      let user = await this.userRepository.findByCondition({
        where: { userName },
      });
      userId = user?.id;
      if (!user) {
        const userData = this.userRepository.create({ userName });
        user = await this.userRepository.save(userData);
        userId = user.id;
      }
      this.logger.log(
        `User ${(user.id, user.userName)} logged in successfully.`,
      );
      return {
        statusCode: HttpStatus.OK,
        data: { userId, userName: user.userName },
      };
    } catch (error) {
      this.logger.error(`Error in user login : ${error}`);
      throw error;
    }
  }
}
