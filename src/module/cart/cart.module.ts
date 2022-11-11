import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './../product/product.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
