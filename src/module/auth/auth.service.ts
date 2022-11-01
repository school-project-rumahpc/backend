import { AuthHelper } from './helper/auth.helper';
import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private authHelper: AuthHelper) {}

  async register(dto: CreateUserDto) {
    // Get User's email
    const { email } = dto;

    // check if the user exists in the db
    const userInDb = await this.authHelper.getUserByEmail(email);

    if (userInDb)
      throw new BadRequestException(
        `User with email ${email} has already exists!`,
      );

    // Creating User
    const user = await this.authHelper.createUser(dto);

    return user;
  }

  async login(email: string, password: string) {
    // Check user in database
    const user = await this.authHelper.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const isPasswordValid: boolean = this.authHelper.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid Password !');
    }

    const token = this.authHelper.generateToken(user);

    return token;
  }
}
