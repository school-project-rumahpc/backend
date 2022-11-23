import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { Cart } from '../cart/entity/cart.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { Order } from './entity/order.entity';
import { Payment } from './entity/payment.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Cart, Order, User, Payment]),
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
