import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Role } from '../enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  roles: Role[];
}
