import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllOrders(@Query('deleted') deleted: string) {
    return this.orderService.getAllOrder(deleted);
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtGuard, RoleGuard)
  @Get('payments')
  async getOrderPayment(@Query('deleted') deleted: string) {
    return await this.orderService.getAllOrderPayment(deleted);
  }

  @UseGuards(JwtGuard)
  @Post()
  createOrder(@GetUser() user) {
    return this.orderService.createOrder(user);
  }

  // @Roles(Role.USER)
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body('order_id') orderId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.orderService.uploadPaymentFile(orderId, file.buffer);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('accept')
  acceptOrder(@Body('order_id') orderId: string) {
    return this.orderService.acceptOrder(orderId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('reject')
  rejectOrder(@Body('order_id') orderId: string) {
    return this.orderService.rejectOrder(orderId);
  }
}
