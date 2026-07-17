import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  addTweet(@Body() createTweetDto: CreateTweetDto) {
    return this.tweetService.addTweet(createTweetDto);
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
