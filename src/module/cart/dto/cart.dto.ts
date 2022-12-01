import { IsNotEmpty, IsString } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
