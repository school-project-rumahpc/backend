import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDetailsDto } from './create-product-details.dto';

export class UpdateProductDetailsDto extends PartialType(
  CreateProductDetailsDto,
) {
  id: string;

  processor: string;

  motherboard: string;

  memory: string;

  storage: string;

  graphics: string;

  display: string;

  psu: string;

  casing: string;
}
