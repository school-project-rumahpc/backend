import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { Readable } from 'stream';
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

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtGuard, RoleGuard)
  @Get('payment')
  async getOrderPayment(@Res({ passthrough: true }) res: Response) {
    const file = await this.orderService.getAllOrderPayment();

    const stream = Readable.from(file.map((file) => file.data));

    res.set({
      'Content-Disposition': `inline; filename="${file.map(
        (file) => file.filename,
      )}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
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
