import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  validatePassword(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  async register(dto: CreateUserDto) {
    // Get User's email
    const { email, username } = dto;

    // check if the user exists in the db
    const userInDb =
      (await this.userService.findByName(username)) ||
      (await this.userService.findByEmail(email));

    if (userInDb) throw new BadRequestException(`User has already exists!`);

    // Creating User
    await this.userService.create(dto);

    return {
      message: 'Register success!',
    };
  }

  generateToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    };

    const secret = this.config.get('JWT_SECRET');

    return this.jwtService.sign(payload, {
      expiresIn: '365d',
      secret,
    });
  }

  async login(dto: LoginDto) {
    const { emailOrUsername, password } = dto;
    // Check user in database
    const user = await this.userService.findUser(emailOrUsername);

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const isPasswordValid: boolean = this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid Password !');
    }

    const token = this.generateToken(user);

    return token;
  }
}
