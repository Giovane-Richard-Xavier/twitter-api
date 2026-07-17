import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IsPublic } from './decorators/is-public.decorator';
import { SignInDto } from './dtos/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signin(
    @Request() req: { user: SignInDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signin(req.user);
  }

  @IsPublic()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto) {
    const result = await this.authService.signup(dto);

    return {
      success: true,
      result,
    };
  }
}
