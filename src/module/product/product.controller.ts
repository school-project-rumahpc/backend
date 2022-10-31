import { CategoryService } from './../category/category.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDetailsDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.category_id,
    );

    return await this.productService.create(createProductDto, category);
  }

  @Get()
  async getProducts(@Query('s') search: string, @Query('price') price: any) {
    if (search || price) {
      return await this.productService.filterProducts(search, price);
    }
    return await this.productService.findAllProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post(':id/details')
  createProductDetails(
    @Param('id') id: string,
    @Body() createProductDetailsDto: CreateProductDetailsDto,
  ) {
    return this.productService.createProductDetails(
      id,
      createProductDetailsDto,
    );
  }
}
