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
  CreateImageDto,
  CreateProductDetailsDto,
  CreateProductDto,
  UpdateImageDto,
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

  @Get()
  async getProducts(
    @Query('product_name') product_name: string,
    @Query('price') price: any,
    @Query('date') date: any,
  ) {
    if (product_name || price) {
      return await this.productService.filterProducts(product_name, price);
    } else if (date) {
      return this.productService.filterProductDate(date);
    }
    return await this.productService.findAllProducts();
  }

  @Get('details')
  getAllDetails() {
    return this.productService.findAllDetails();
  }

  @Get('images')
  getAllImages() {
    return this.productService.findAllImages();
  }

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const category = await this.categoryService.findOne(dto.category_id);

    return await this.productService.create(dto, category);
  }

  @Post('/details')
  async createProductDetails(@Body() dto: CreateProductDetailsDto) {
    const product = await this.productService.findOne(dto.product_id);
    return this.productService.createDetails(dto, product);
  }

  @Post('/images')
  async createProductImages(@Body() dto: CreateImageDto) {
    const product = await this.productService.findOne(dto.product_id);
    return this.productService.createImages(dto, product);
  }

  @Get(':id')
  getOneProduct(@Param('id') id: string) {
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

  @Patch(':id/details')
  updateDetails(@Param('id') id: string, @Body() dto: UpdateProductDetailsDto) {
    return this.productService.updateProductDetails(id, dto);
  }

  @Patch(':id/images')
  updateImage(@Param('id') id: number, @Body() dto: UpdateImageDto) {
    return this.productService.updateImage(id, dto);
  }
}
