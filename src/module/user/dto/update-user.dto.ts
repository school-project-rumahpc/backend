import { PartialType } from '@nestjs/mapped-types';
import { IsPhoneNumber, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username: string;
  email: string;

  @IsPhoneNumber('ID')
  phone: string;

  @MinLength(8)
  password: string;
}
