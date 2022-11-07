import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  findAll() {
    return this.userRepository.find({ relations: ['role'] });
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

  async findById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    try {
      return user;
    } catch (err) {
      throw new BadRequestException(`User with id: ${id} not found`);
    }
  }

  async findBy(email: string, username: string) {
    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    try {
      return user;
    } catch (err) {
      throw new BadRequestException(`User with email: ${email} not found`);
    }
  }

  async create(dto: CreateUserDto, role: Role) {
    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);

    role.users = [...role.users, user];
    await this.roleRepository.save(role);

    return user;
  }
}
