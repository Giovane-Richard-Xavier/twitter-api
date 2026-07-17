import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  addTweet(@Request() req: { user: any }, @Body() dto: CreateTweetDto) {
    console.log('user controller->', req.user);
    return this.tweetService.addTweet(req.user, dto);
  }

  @Get()
  findAllTweet() {
    return this.tweetService.findAllTweet();
  }

  @Get(':id')
  findTweet(@Param('id') id: string) {
    return this.tweetService.findTweet(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tweetService.remove(+id);
  }
}
