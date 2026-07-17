import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  userSlug!: string;

  @IsNotEmpty()
  @IsString()
  body!: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @Transform(() => Number)
  answer?: number;
}
