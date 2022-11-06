import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entity/category.entity';
import { CategoryService } from './../category/category.service';
import { Details, Images, Products } from './entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category, Details, Images])],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
