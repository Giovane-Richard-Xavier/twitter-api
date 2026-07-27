import { Injectable, NotFoundException } from '@nestjs/common';
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
        slug: true,
        bio: true,
        link: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  async getUser(slug: string) {
    const user = await this.findUserBySlug(slug);

    const followingCount = await this.getUserFollowingCoung(user.slug);
    const followersCount = await this.getUserFollowersCoung(user.slug);
    const tweetCount = await this.getUserTweetCount(user.slug);

    return {
      user,
      followingCount,
      followersCount,
      tweetCount,
    };
  }

  async getUserFollowingCoung(slug: string) {
    return await this.prisma.follow.count({
      where: { user1Slug: slug },
    });
  }

  async getUserFollowersCoung(slug: string) {
    return await this.prisma.follow.count({
      where: { user2Slug: slug },
    });
  }

  async getUserTweetCount(slug: string) {
    return await this.prisma.tweet.count({
      where: { userSlug: slug },
    });
  }

  async getUserTweets(slug: string) {}

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
