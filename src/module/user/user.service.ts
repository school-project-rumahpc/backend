import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find({ relations: ['carts', 'carts.item'] });
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

    return await this.userRepository.save(user);
  }
}
