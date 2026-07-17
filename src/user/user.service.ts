import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPublicURL } from '../utils/url';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return {
        ...user,
        avatar: getPublicURL(user.avatar),
        cover: getPublicURL(user.cover),
      };
    }

    return null;
  }

  async findUserBySlug(slug: string) {
    const user = await this.prisma.user.findFirst({
      where: { slug },
      select: {
        avatar: true,
        cover: true,
        name: true,
        bio: true,
        link: true,
      },
    });

    if (user) {
      return {
        ...user,
        avatar: getPublicURL(user.avatar),
        cover: getPublicURL(user.cover),
      };
    }

    return null;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
