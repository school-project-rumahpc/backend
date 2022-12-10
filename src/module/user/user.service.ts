import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find({
      relations: ['carts', 'carts.item', 'orders'],
    });
  }

  async findByName(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    try {
      return user;
    } catch (err) {
      throw new BadRequestException(
        `User with username: ${username} not found`,
      );
    }
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    try {
      return user;
    } catch (err) {
      throw new BadRequestException(`User with email: ${email} not found`);
    }
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['carts', 'carts.item', 'orders'],
    });

    try {
      return user;
    } catch (err) {
      throw new BadRequestException(`User with id: ${id} not found`);
    }
  }

  async findUser(emailOrUsername: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    try {
      return user;
    } catch (err) {
      throw new BadRequestException(`User not found`);
    }
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);

    await this.userRepository.save(user);

    return {
      message: 'Create user success!',
    };
  }

  async updateUser(id: string, { username, email, phone }: UpdateUserDto) {
    const user = await this.findById(id);

    user.username = username;
    user.email = email;
    user.phone = phone;

    await this.userRepository.save(user);

    return { message: 'Update success' };
  }

  async updateUserPassword(userId: string, { password }: UpdateUserDto) {
    const user = await this.findById(userId);

    const isPasswordSame = bcrypt.compareSync(password, user.password);

    if (isPasswordSame) {
      throw new BadRequestException('Please insert a different password');
    }

    // hashing password
    await this.userRepository.update(userId, {
      password: bcrypt.hashSync(password, 10),
    });

    return {
      message: 'Update password success!',
    };
  }
}
