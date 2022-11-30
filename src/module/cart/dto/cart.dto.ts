import { IsNotEmpty } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  product_id: string;
}
