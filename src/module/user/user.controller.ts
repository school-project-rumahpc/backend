import { User } from './entity/user.entity';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUser() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
