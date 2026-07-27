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
    const hashhtags = dto.body.match(/#[a-zA-Z0-9_]+/g);

    if (hashhtags) {
      for (let hashtag of hashhtags) {
        if (hashtag.length >= 2) {
          await this.addHashtag(hashtag);
        }
      }
    }

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

  async addHashtag(hashtag: string) {
    const hs = await this.prisma.trend.findFirst({
      where: { hashtag },
    });

    if (hs) {
      await this.prisma.trend.update({
        where: { id: hs.id },
        data: {
          counter: hs.counter + 1,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.trend.create({
        data: { hashtag },
      });
    }
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
