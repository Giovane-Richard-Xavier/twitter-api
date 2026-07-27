import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password!: string;
}
