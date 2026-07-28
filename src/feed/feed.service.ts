import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParamsPaginationDto } from '../common/dto/params-pagination.dto';
import { UserService } from '../user/user.service';
import { TweetService } from '../tweet/tweet.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tweetService: TweetService,
  ) {}

  async getFeed(user: any, params: ParamsPaginationDto) {
    const { page = 1, limit = 10, sort = 'desc' } = params;

    const currentPage = Math.max(page, 1);
    const perPage = Math.max(limit, 1);

    // usuários que eu sigo
    const following = await this.userService.getUserFollowing(user.id);
    const tweets = await this.tweetService.findTweetFeed(
      following,
      currentPage,
      perPage,
    );

    return {
      tweets,
      page: currentPage,
      perPage,
    };
  }
}
