import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { Cart } from '../cart/entity/cart.entity';
import { Order } from '../order/entity/order.entity';
import { OrderModule } from '../order/order.module';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => CartModule),
    forwardRef(() => OrderModule),
    TypeOrmModule.forFeature([User, Cart, Order]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
