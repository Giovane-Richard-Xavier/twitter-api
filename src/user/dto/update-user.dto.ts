import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsUrl, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @MinLength(2)
  bio?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
