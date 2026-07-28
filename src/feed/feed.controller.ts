import { Controller, Get, Query, Request } from '@nestjs/common';
import { ParamsPaginationDto } from '../common/dto/params-pagination.dto';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@Request() req: { user: any }, @Query() params: ParamsPaginationDto) {
    return this.feedService.getFeed(req.user, params);
  }
}
