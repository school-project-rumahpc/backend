import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entity/cart.entity';
import { Products } from '../product/entity';
import { User } from '../user/entity/user.entity';
import { Order } from './entity/order.entity';
import { Status } from './enum/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(Products) private productRepository: Repository<Products>,
    private cartService: CartService,
  ) {}

  private readonly logger = new Logger();

  // check all order deadline
  @Cron(CronExpression.EVERY_HOUR)
  async deadlineCheck() {
    this.logger.log('Checking Order deadline...');

    const orders = await this.orderRepository.find();

    if (!orders.length) return;

    orders
      .filter((order) => order.deadline !== null)
      .map((order) => {
        const now = new Date();
        const deadline = order.deadline;

        if (deadline.getTime() < now.getTime()) {
          // restore product stock
          const items = order.items;
          items.map(({ quantity, item }) => {
            const stock = item.stock + quantity;
            this.productRepository.update(item.id, { stock });
          });

          // set status and deadline
          this.updateStatus(order.id, Status.FAIL);
          // soft remove
          this.orderRepository.softDelete(order.id);
        }
      });
  }

  async getAllOrder(deleted: string = 'false') {
    const orders = await this.orderRepository.find({
      relations: ['user'],
      withDeleted: deleted === 'true',
    });

    return orders;
  }

  async getUserOrder(userId: string, deleted: string = 'false') {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      withDeleted: deleted === 'true',
    });

    return orders;
  }

  async getOrderById(id: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });

    if (!order) throw new NotFoundException('Order Not Found!');

    return order;
  }

  async createOrder(user: User) {
    const items = user.carts;
    const totalPrice = await this.cartService.calculateCarts(user.id);

    const newOrder = this.orderRepository.create({
      user,
      totalPrice,
      items,
    });

    await this.orderRepository.save(newOrder);

    // update new product stock
    items.map(({ quantity, item }) => {
      const newStock = item.stock - quantity;
      this.productRepository.update(item.id, { stock: newStock });
    });

    // delete user carts
    await this.cartRepository.remove(items);

    delete newOrder.user;

    return {
      message: 'Create Order success!',
    };
  }

  async updateStatus(id: string, status: Status) {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) throw new NotFoundException('Order Not Found');

    await this.orderRepository.update(
      { id },
      { status: status, deadline: null },
    );

    return {
      message: 'Update success!',
    };
  }

  async acceptOrder(id: string) {
    // update user order
    await this.updateStatus(id, Status.ONQUEUE);

    return { message: 'Success!' };
  }

  async finishOrder(id: string) {
    await this.updateStatus(id, Status.FINISHED);

    return { message: `Order with id: ${id} has finished` };
  }

  async cancelOrder(userId: string, id: string) {
    const order = await this.orderRepository.findOneBy({
      id,
      user: { id: userId },
    });

    if (!order) throw new NotFoundException('Order not found');

    // restore product stock
    const items = order.items;
    items.map(({ quantity, item }) => {
      const stock = item.stock + quantity;
      this.productRepository.update(item.id, { stock });
    });

    // set order's status to fail
    await this.updateStatus(id, Status.FAIL);
    // soft delete order
    await this.orderRepository.softDelete(id);

    return { message: 'Order cancelled' };
  }

  async rejectOrder(id: string) {
    const order = await this.orderRepository.findOneBy({ id });
    await this.updateStatus(id, Status.FAIL);

    // restore product stock
    const items = order.items;
    items.map(({ quantity, item }) => {
      const stock = item.stock + quantity;
      this.productRepository.update(item.id, { stock });
    });

    // soft delete user order
    await this.orderRepository.softDelete(id);

    return { message: 'Success!' };
  }

  async uploadOrderImage(orderId: string, filePath: string) {
    await this.orderRepository.update(orderId, { image: filePath });

    await this.updateStatus(orderId, Status.PENDING);

    return { message: 'Upload success!' };
  }
}
