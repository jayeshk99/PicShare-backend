import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(userName: string) {
    try {
      let userId: string;
      const user = await this.userRepository.findByCondition({
        where: { userName },
      });
      userId = user?.id;
      if (!user) {
        const userData = this.userRepository.create({ userName });
        const newUser = await this.userRepository.save(userData);
        userId = newUser.id;
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
