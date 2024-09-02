import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
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
      return {
        statusCode: HttpStatus.OK,
        data: { userId, userName: user.userName },
      };
    } catch (error) {
      throw error;
    }
  }
}
