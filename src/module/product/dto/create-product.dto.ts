import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  image: string;

  @IsNotEmpty()
  category_id: string;
}
