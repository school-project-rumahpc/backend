import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  stock: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsOptional()
  @IsInt()
  qty: number;

  @IsString({ each: true })
  images: string[];

  @IsNotEmpty()
  category_id: string;
}
