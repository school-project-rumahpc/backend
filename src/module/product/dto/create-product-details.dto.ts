import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDetailsDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  processor: string;

  @IsOptional()
  motherboard: string;

  @IsNotEmpty()
  memory: string;

  @IsNotEmpty()
  storage: string;

  @IsNotEmpty()
  graphics: string;

  @IsOptional()
  display: string;

  @IsOptional()
  psu: string;

  @IsOptional()
  casing: string;
}
