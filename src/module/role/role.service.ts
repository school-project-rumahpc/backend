import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(dto: CreateRoleDto) {
    const role = this.roleRepository.create(dto);

    return await this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find({
      order: { id: 'ASC' },
      relations: ['users'],
    });
  }

  async findById(id: number) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role)
      throw new BadRequestException(`Role with id ${id} is not found!`);
    return role;
  }

  async findByName(name: string) {
    const role = await this.roleRepository.findOne({
      where: { role_name: name },
      relations: ['users'],
    });

    if (!role)
      throw new BadRequestException(`Role with name ${name} is not found!`);

    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findById(id);
    if (!role)
      throw new BadRequestException(`Role with id ${id} is not found!`);
    role.role_name = dto.role_name;

    return await this.roleRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.findById(id);

    if (!role)
      throw new BadRequestException(`Role with id ${id} is not found!`);
    await this.roleRepository.remove(role);

    return `Role with Id ${id} has been deleted!`;
  }
}
