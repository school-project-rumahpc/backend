import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entity/cart.entity';
import { Products } from '../product/entity';
import { User } from '../user/entity/user.entity';
import { Order } from './entity/order.entity';
import { Payment } from './entity/payment.entity';
import { Status } from './enum/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
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

          order.status = Status.FAIL;
          order.deadline = null;
          this.orderRepository.softRemove(order);
        }
      });
  }

  async getAllOrder(deleted: string = 'false', payment: string = 'true') {
    const orders = await this.orderRepository.find({
      relations: ['user', 'payment'],
      withDeleted: deleted === 'true',
    });

    if (payment === 'false') {
      return orders.map((order) => {
        delete order.payment;
        return order;
      });
    }
    return orders;
  }

  async getUserOrder(userId: string, deleted: string) {
    const orders = await this.getAllOrder(deleted);

    return orders.filter((order) => {
      order.user.id === userId;
      delete order.user;
      return order;
    });
  }

  async getAllOrderPayment(deleted: string = 'false') {
    const orders = await this.orderRepository.find({
      relations: ['payment'],
      withDeleted: deleted === 'true',
    });

    const payments = orders
      .filter((order) => order.payment !== null)
      .map((order) =>
        btoa(String.fromCharCode.apply(null, order.payment.file)),
      );
    return payments;
  }

  async getOrderById(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['payment'],
      withDeleted: true,
    });

    if (!order) throw new NotFoundException('Order Not Found!');

    if (order.user !== user)
      throw new ForbiddenException('Cant get Order, invalid User!');
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

    return newOrder;
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

  async uploadFileBuffer(order: Order, fileBuffer: Buffer) {
    const newPayment = this.paymentRepository.create({
      order,
      file: fileBuffer,
    });

    await this.paymentRepository.save(newPayment);
    return newPayment;
  }

  async uploadPaymentFile(orderId: string, fileBuffer: Buffer) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });
    const payment = await this.uploadFileBuffer(order, fileBuffer);

    await this.orderRepository.update(
      { id: order.id },
      { payment, deadline: null, status: Status.PENDING },
    );

    return { message: 'Upload success!' };
  }
}
