import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { CategoryService } from './../category/category.service';
import {
  CreateProductDetailsDto,
  CreateProductDto,
  UpdateProductDetailsDto,
  UpdateProductDto,
} from './dto';
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

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const category = await this.categoryService.findOne(dto.category_id);

    return await this.productService.create(dto, category);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/details')
  async createProductDetails(@Body() dto: CreateProductDetailsDto) {
    const product = await this.productService.findOne(dto.product_id);
    return this.productService.createDetails(dto, product);
  }

  @Get(':id')
  getOneProduct(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id/details')
  updateDetails(@Param('id') id: string, @Body() dto: UpdateProductDetailsDto) {
    return this.productService.updateProductDetails(id, dto);
  }
}
