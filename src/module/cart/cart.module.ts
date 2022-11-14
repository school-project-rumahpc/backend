import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Products } from './../product/entity/product.entity';
import { ProductModule } from './../product/product.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';
import { Item } from './entity/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Item, User, Products]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
