import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './../category/category.service';
import {
  CreateProductDetailsDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';
import { UpdateProductDetailsDto } from './dto/update-product-details.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const category = await this.categoryService.findOne(dto.category_id);

    return await this.productService.create(dto, category);
  }

  @Get()
  async getProducts(
    @Query('product_name') product_name: string,
    @Query('price') price: any,
  ) {
    if (product_name || price) {
      return await this.productService.filterProducts(product_name, price);
    }
    return await this.productService.findAllProducts();
  }

  @Get('details')
  findAllDetails() {
    return this.productService.getAllDetails();
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

  @Post('/details')
  async createProductDetails(@Body() dto: CreateProductDetailsDto) {
    const product = await this.productService.findOne(dto.product_id);
    return this.productService.createProductDetails(dto, product);
  }

  @Patch(':id/details')
  updateDetails(@Param('id') id: string, @Body() dto: UpdateProductDetailsDto) {
    return this.productService.updateProductDetails(id, dto);
  }
}
