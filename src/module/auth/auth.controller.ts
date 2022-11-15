import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user')
  @UseGuards(JwtGuard)
  async authUser(@GetUser() user) {
    return user;
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body('emailOrUsername') emailOrUsername: string,
    @Body('password') password: string,
  ) {
    const token = await this.authService.login(emailOrUsername, password);

    // save token in cookie
    // res.cookie('jwt', token);

    return {
      access_token: token,
    };
  }
}
