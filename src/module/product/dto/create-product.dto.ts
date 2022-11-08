import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @IsString({ each: true })
  images: string[];

  @IsNotEmpty()
  category_id: string;
}
