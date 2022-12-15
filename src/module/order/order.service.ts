import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entity/cart.entity';
import { Products } from '../product/entity';
import { User } from '../user/entity/user.entity';
import { Role } from '../user/enum/role.enum';
import { OrderDto } from './dto/order.dto';
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
      .map((order) => this.checkOrderDeadline(order));
  }

  checkOrderDeadline({ id, deadline, items }: Order) {
    if (deadline !== null) {
      const now = new Date();

      if (deadline.getTime() < now.getTime()) {
        // restore product stock
        this.restoreProductStock(id, items);
      }
    }
  }

  restoreProductStock(id, items) {
    items.map(({ quantity, item }) => {
      const stock = item.stock + quantity;
      this.productRepository.update(item.id, { stock });
    });

    // set status and deadline
    this.updateStatus(id, Status.FAIL);
    // soft remove
    this.orderRepository.softDelete(id);
  }

  async getAllOrder(deleted: string = 'false', status: Status) {
    const allOrders = await this.orderRepository.find({
      where: status && { status },
      relations: ['user'],
      withDeleted: deleted === 'true',
    });

    // checking order deadline
    allOrders.map((order) => this.checkOrderDeadline(order));

    return allOrders;
  }

  async getUserOrder(userId: string, deleted: string = 'false') {
    const allOrders = await this.orderRepository.find({
      where: { user: { id: userId } },
      withDeleted: deleted === 'true',
      order: { orderDate: 'DESC' },
    });

    // checking user order deadline
    allOrders.map((order) => this.checkOrderDeadline(order));

    return allOrders;
  }

  async getOrderById(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: true,
    });

    if (!order) throw new NotFoundException('Order Not Found!');

    if (order.user.id == user.id || user.role == Role.ADMIN) {
      return order;
    }

    return new ForbiddenException();
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

  async acceptOrder({ order_id }: OrderDto) {
    // update user order
    await this.updateStatus(order_id, Status.APPROVED);

    return { message: 'Success!' };
  }

  async finishOrder({ order_id }: OrderDto) {
    await this.updateStatus(order_id, Status.FINISHED);

    return { message: `Order with id: ${order_id} has finished` };
  }

  async deleteImage({ id, image }: Order) {
    const path = image.split('/')[4];
    fs.unlinkSync(path);
    await this.orderRepository.update(id, { image: null });
  }

  async cancelOrder(userId: string, { order_id }: OrderDto) {
    const order = await this.orderRepository.findOneBy({
      id: order_id,
      user: { id: userId },
    });

    if (!order) throw new NotFoundException('Order not found');

    // if order has an image
    if (order.image) this.deleteImage(order);

    // restore product stock
    this.restoreProductStock(order_id, order.items);

    return { message: 'Order cancelled' };
  }

  async rejectOrder({ order_id }: OrderDto) {
    const order = await this.orderRepository.findOneBy({ id: order_id });

    if (!order) throw new NotFoundException('Order not found');

    // restore product stock
    this.restoreProductStock(order_id, order.items);

    return { message: 'Success!' };
  }

  async uploadOrderImage(orderId: string, filePath: string) {
    const path = `http://localhost:3333/api/${filePath}`;
    await this.orderRepository.update(orderId, { image: path });

    await this.updateStatus(orderId, Status.PENDING);

    return { message: 'Upload success!' };
  }
}
