import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  product_name: string;

  @IsNotEmpty()
  @IsInt()
  stock: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsNotEmpty()
  category_id: string;
}
