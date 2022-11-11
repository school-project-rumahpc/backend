import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entity/category.entity';
import { CategoryService } from './../category/category.service';
import { Details, Products } from './entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category, Details])],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
  exports: [ProductService],
})
export class ProductModule {}
