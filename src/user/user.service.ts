import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPublicURL } from '../utils/url';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamsPaginationDto } from '../common/dto/params-pagination.dto';

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

  async getUserTweets(slug: string, params: ParamsPaginationDto) {
    const { page = 1, limit = 10, sort = 'desc' } = params;

    const currentPage = Math.max(page, 1);
    const perPage = Math.max(limit, 1);
    const skip = (currentPage - 1) * perPage;

    const [total, tweets] = await this.prisma.$transaction([
      this.prisma.tweet.count({ where: { userSlug: slug } }),
      this.prisma.tweet.findMany({
        where: { userSlug: slug, answerOf: 0 },
        skip,
        take: perPage,
        orderBy: { createdAt: sort },
        include: {
          likes: {
            select: { userSlug: true },
          },
        },
      }),
    ]);

    return {
      tweets,
      total,
      page: currentPage,
      perPage,
    };
  }

  async followToggle(user: any, slug: string) {
    console.log('user->', user);
    const hasUserToBeFollowed = await this.findUserBySlug(slug);

    if (!hasUserToBeFollowed) {
      throw new NotFoundException('User not found!');
    }

    const me = user.id;

    const follow = await this.checkIfFollows(me, slug);

    if (!follow) {
      await this.follow(me, slug);
      return { following: true };
    } else {
      await this.unfollow(me, slug);
      return { following: false };
    }
  }

  async checkIfFollows(user1Slug: string, user2Slug: string) {
    const follow = await this.prisma.follow.findFirst({
      where: { user1Slug, user2Slug },
    });

    return follow ? true : false;
  }

  async follow(user1Slug: string, user2Slug: string) {
    await this.prisma.follow.create({
      data: {
        user1Slug,
        user2Slug,
      },
    });
  }

  async unfollow(user1Slug: string, user2Slug: string) {
    await this.prisma.follow.deleteMany({
      where: {
        user1Slug,
        user2Slug,
      },
    });
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
