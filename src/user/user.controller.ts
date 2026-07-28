import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ParamsPaginationDto } from '../common/dto/params-pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/suggestions')
  getUserSuggestions(@Request() req: { user: any }) {
    return this.userService.getUserSuggestions(req.user);
  }
  @Get(':slug')
  getUser(@Param('slug') slug: string) {
    return this.userService.getUser(slug);
  }

  @Get(':slug/tweets')
  getUserTweets(
    @Param('slug') slug: string,
    @Query() params: ParamsPaginationDto,
  ) {
    return this.userService.getUserTweets(slug, params);
  }

  @Post(':slug/follow')
  likeToggle(@Request() req: { user: any }, @Param('slug') slug: string) {
    return this.userService.followToggle(req.user, slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch()
  updateUser(@Request() req: { user: any }, @Body() dto: UpdateUserDto) {
    return this.userService.updateUserInfo(req.user, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
