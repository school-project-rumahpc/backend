import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { Order } from './entity/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private cartService: CartService,
    private userService: UserService,
  ) {}

  async getAllOrder() {
    return this.orderRepository.find();
  }

  async createOrder(user: User) {
    const items = user.carts;
    const totalPrice = await this.cartService.calculateCarts(user.id);

    const newOrder = this.orderRepository.create({ user, totalPrice, items });

    return await this.orderRepository.save(newOrder);
  }
}
