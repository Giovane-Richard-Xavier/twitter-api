import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  body!: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  // @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  answer?: number;
}
