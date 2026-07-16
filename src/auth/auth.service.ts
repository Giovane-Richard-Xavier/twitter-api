import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../types/auth-user';
import { UserPayload } from './models/userPayload';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import slug from 'slug';
import { getPublicURL } from '../utils/url';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: AuthUser) {
    const payload: UserPayload = {
      sub: user.slug,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    return { token, user: payload };
  }

  async signup(dto: CreateUserDto) {
    const { name, email, password } = dto;

    // Verifica se o e-mail já existe
    const hasEmail = await this.userService.findUserByEmail(email);

    if (hasEmail) {
      throw new ConflictException('Email is already in use.');
    }

    // Verifica o slug
    let genSlug = true;
    let userSlug = slug(name);

    while (genSlug) {
      const hasSlug = await this.userService.findUserBySlug(userSlug);

      if (hasSlug) {
        let slugSuffix = Math.floor(Math.random() * 999999).toString();
        userSlug = slug(name + slugSuffix);
      } else {
        genSlug = false;
      }
    }

    // gerar hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // cria user
    const newUser = await this.prisma.user.create({
      data: {
        slug: userSlug,
        name,
        email,
        password: hashPassword,
      },
    });

    const userData = {
      ...newUser,
      avatar: getPublicURL(newUser.avatar),
      cover: getPublicURL(newUser.cover),
    };

    // cria o token
    const payload = {
      sub: userData.slug,
      email: userData.email,
      name: userData.name,
    };
    const token = this.jwtService.sign(payload);

    // const { password: _, ...safeUser } = userData;

    return {
      token,
      user: {
        ...payload,
        avatar: userData.avatar,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Sua conta ainda não foi ativada. Verifique seu e-mail.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
