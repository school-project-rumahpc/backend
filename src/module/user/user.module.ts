import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { Cart } from '../cart/entity/cart.entity';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => CartModule),
    TypeOrmModule.forFeature([User, Cart]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
