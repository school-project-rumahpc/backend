import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../product/entity';
import { ProductModule } from '../product/product.module';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Products, User]),
    ProductModule,
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
