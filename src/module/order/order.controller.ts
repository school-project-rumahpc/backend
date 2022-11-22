import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllOrders() {
    return this.orderService.getAllOrder();
  }

  @UseGuards(JwtGuard)
  @Post()
  createOrder(@GetUser() user) {
    return this.orderService.createOrder(user);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('accept')
  acceptOrder(@Body('order_id') orderId: string) {
    return this.orderService.acceptOrder(orderId);
  }

  @Get('time')
  getTime() {
    return this.orderService.getTime();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('reject')
  rejectOrder(@Body('order_id') orderId: string) {
    return this.orderService.rejectOrder(orderId);
  }
}
