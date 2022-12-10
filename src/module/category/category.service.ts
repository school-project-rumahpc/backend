import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entity/category.entity';

@Global()
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);

    await this.categoryRepository.save(newCategory);
    return {
      message: 'Create category success!',
    };
  }

  findAll() {
    return this.categoryRepository.find({
      relations: ['products', 'products.details'],
      order: { products: { id: 'ASC' } },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'products.details'],
      order: { id: 'ASC' },
    });

    if (!category)
      throw new HttpException(
        `Product with id ${id} is not found !`,
        HttpStatus.NOT_FOUND,
      );

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    category.category_name = updateCategoryDto.category_name;

    await this.categoryRepository.save(category);
    return {
      message: 'Update category success!',
    };
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);
    return {
      message: `Category with id ${id} successfully deleted!`,
    };
  }
}
