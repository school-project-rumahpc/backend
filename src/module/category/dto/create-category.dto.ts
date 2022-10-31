import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  category_name: string;
}
