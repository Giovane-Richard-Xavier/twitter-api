import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPublicURL } from '../utils/url';

@Injectable()
export class TweetService {
  constructor(private readonly prisma: PrismaService) {}

  async addTweet(user: any, dto: CreateTweetDto) {
    // verifica se é resposta
    if (dto.answer) {
      const hasAnswerTweet = await this.findTweet(dto.answer);

      if (!hasAnswerTweet) {
        throw new NotFoundException('Original Tweet not found!');
      }
    }

    console.log('user ->', user);

    // cria o tweet
    const newTweet = await this.prisma.tweet.create({
      data: {
        userSlug: user.id,
        body: dto.body,
        answerOf: dto.answer ?? 0,
      },
    });

    //adicionaa hashtag ao tend

    return newTweet;
  }

  async findAllTweet() {
    return `This action returns all tweet`;
  }

  async findTweet(id: number) {
    const tweet = await this.prisma.tweet.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            slug: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userSlug: true,
          },
        },
      },
    });

    if (tweet) {
      tweet.user.avatar = getPublicURL(tweet.user.avatar);
      return tweet;
    }
    return null;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
