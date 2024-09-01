import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsUrl({}, { message: 'imageUrl must be a valid URL ' })
  @IsNotEmpty({ message: 'imageUrl is required' })
  imageUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;
}
