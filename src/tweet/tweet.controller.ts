import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { ParamsPaginationDto } from '../common/dto/params-pagination.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  addTweet(@Request() req: { user: any }, @Body() dto: CreateTweetDto) {
    return this.tweetService.addTweet(req.user, dto);
  }

  @Get('search')
  searchTweets(@Query() params: ParamsPaginationDto) {
    return this.tweetService.searchTweets(params);
  }

  @Get()
  findAllTweet() {
    return this.tweetService.findAllTweet();
  }

  @Get(':id')
  findTweet(@Param('id') id: string) {
    return this.tweetService.findTweet(+id);
  }

  @Get(':id/answers')
  getAnswers(@Param('id') id: string) {
    return this.tweetService.getAnswers(+id);
  }

  @Post(':id/like')
  likeToggle(@Request() req: { user: any }, @Param('id') id: string) {
    return this.tweetService.likeToggle(req.user, +id);
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
