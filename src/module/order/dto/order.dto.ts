import { IsNotEmpty, IsString } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  order_id: string;
}
