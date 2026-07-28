import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guards';
import { TweetModule } from './tweet/tweet.module';
import { FeedModule } from './feed/feed.module';
import { TrendModule } from './trend/trend.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, TweetModule, FeedModule, TrendModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
