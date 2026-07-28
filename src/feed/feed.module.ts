import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TweetModule } from '../tweet/tweet.module';

@Module({
  imports: [PrismaModule, UserModule, TweetModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
