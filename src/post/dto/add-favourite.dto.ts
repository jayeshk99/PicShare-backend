import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class AddFavouriteDto {
  @IsString()
  @IsNotEmpty({ message: 'postId required' })
  postId: string;

  @IsString()
  @IsNotEmpty({ message: 'userid is required' })
  userId: string;
}
