import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  name: string;

  @IsInt()
  stock: number;

  @IsInt()
  price: number;

  @IsString({ each: true })
  images: string[];

  category_id: string;

  details_id: string;
}
