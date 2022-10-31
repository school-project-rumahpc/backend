import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  product_name: string;

  stock: number;

  price: number;

  image: string;

  categoryId: string;
}
