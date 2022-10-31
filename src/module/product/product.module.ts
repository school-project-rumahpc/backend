import { CategoryService } from './../category/category.service';
import { Details } from './entity/details.entity';
import { Category } from '../category/entity/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Products } from './entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category, Details])],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
