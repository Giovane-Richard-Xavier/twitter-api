import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sigin')
  async login(
    @Request() req: { user: any },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(req.user);
  }

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
