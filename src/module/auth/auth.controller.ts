import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user')
  @UseGuards(JwtGuard)
  async authUser(@Req() req: Request) {
    return req.user;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(emailOrUsername, password);

    res.cookie('jwt', token, { httpOnly: true });
    return {
      message: 'Login success!',
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }
}
