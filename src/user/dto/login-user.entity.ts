import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// create-user-dto
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  userName: string;
}
