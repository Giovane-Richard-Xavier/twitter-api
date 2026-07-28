import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPublicURL } from '../utils/url';
import { ParamsPaginationDto } from '../common/dto/params-pagination.dto';

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

    if (!tweet) {
      throw new NotFoundException('Tweet not found!');
    }

    tweet.user.avatar = getPublicURL(tweet.user.avatar);

    return tweet;
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

  async getAnswers(id: number) {
    const answers = await this.prisma.tweet.findMany({
      where: { answerOf: id },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            slug: true,
          },
        },
        likes: {
          select: {
            userSlug: true,
          },
        },
      },
    });

    if (!answers) {
      throw new NotFoundException('Tweet not found!');
    }

    answers.map((item) => (item.user.avatar = getPublicURL(item.user.avatar)));

    return answers;
  }

  async likeToggle(user: any, id: number) {
    const liked = await this.checkIfTweetIsLikedByUser(user.id, id);

    if (liked) {
      this.unlikeTweet(user.id, id);
    } else {
      this.likeTweet(user.id, id);
    }
  }

  async checkIfTweetIsLikedByUser(slug: string, id: number) {
    const isLiked = await this.prisma.tweetLike.findFirst({
      where: {
        userSlug: slug,
        tweetId: id,
      },
    });

    return isLiked ? true : false;
  }

  async unlikeTweet(slug: string, id: number) {
    await this.prisma.tweetLike.deleteMany({
      where: {
        userSlug: slug,
        tweetId: id,
      },
    });
  }

  async likeTweet(slug: string, id: number) {
    await this.prisma.tweetLike.create({
      data: {
        userSlug: slug,
        tweetId: id,
      },
    });
  }

  async findTweetFeed(
    following: string[],
    currentPage: number,
    perPage: number,
  ) {
    const skip = (currentPage - 1) * perPage;

    const tweets = await this.prisma.tweet.findMany({
      where: {
        userSlug: { in: following },
        answerOf: 0,
      },
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            slug: true,
          },
        },
        likes: {
          select: {
            userSlug: true,
          },
        },
      },
    });

    tweets.map((item) => (item.user.avatar = getPublicURL(item.user.avatar)));

    return { tweets };
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
