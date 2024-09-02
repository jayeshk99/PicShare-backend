import { IsString, IsNotEmpty } from 'class-validator';

export class AddFavouriteDto {
  @IsString()
  @IsNotEmpty({ message: 'postId required' })
  postId: string;
}
