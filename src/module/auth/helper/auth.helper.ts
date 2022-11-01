import { CreateUserDto } from './../../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from './../../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../../user/user.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/module/role/role.service';

@Injectable()
export class AuthHelper {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private roleService: RoleService,
  ) {}

  getUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  validatePassword(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
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

  async createUser(dto: CreateUserDto) {
    const role = await this.roleService.findByName(dto.role_name);

    return await this.userService.create(dto, role);
  }
}
