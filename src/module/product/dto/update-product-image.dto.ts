import { PartialType } from '@nestjs/mapped-types';
import { CreateImageDto } from './create-product-images.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  url: string;

  product_id: string;
}
