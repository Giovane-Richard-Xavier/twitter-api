import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt, { compare } from 'bcrypt';
import slug from 'slug';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { getPublicURL } from '../utils/url';
import { SignInDto } from './dtos/auth.dto';
import { UserPayload } from './models/userPayload';
import { AuthUser } from '../types/auth-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signin(user: any) {
    // const user = await this.userService.findUserByEmail(email);

    // if (!user) {
    //   throw new UnauthorizedException('User unauthorized.');
    // }

    // const verifyPass = await compare(password, user.password);

    // if (!verifyPass) {
    //   throw new UnauthorizedException('User unauthorized.');
    // }

    const payload: UserPayload = {
      sub: user.slug,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        name: user.name,
        slug: user.slug,
        avatar: getPublicURL(user.avatar),
        cover: getPublicURL(user.cover),
      },
    };
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
