import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  emailOrUsername: string;

  @IsNotEmpty()
  password: string;
}
