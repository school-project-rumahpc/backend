import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { Order } from './entity/order.entity';
import { Status } from './enum/status.enum';

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

  async updateOrder(orderId: string, status: Status[]) {
    await this.orderRepository.update({ id: orderId }, { status: status });

    return {
      message: 'Update success!',
    };
  }

  async deleteOrder(orderId: string) {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    await this.orderRepository.softRemove(order);

    return { message: 'Delete success!' };
  }
}
