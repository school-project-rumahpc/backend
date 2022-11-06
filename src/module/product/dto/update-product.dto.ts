import { PartialType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  product_name: string;

  @IsInt()
  stock: number;

  @IsInt()
  price: number;

  images_id: string;

  category_id: string;

  details_id: string;
}
