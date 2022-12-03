import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllOrders(
    @Query('deleted') deleted: string,
    @Query('payment') payment: string,
  ) {
    return this.orderService.getAllOrder(deleted, payment);
  }

  @Get(':id')
  getOneOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('payments')
  async getOrderPayment(@Query('deleted') deleted: string) {
    return await this.orderService.getAllOrderPayment(deleted);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  createOrder(@GetUser() user) {
    return this.orderService.createOrder(user);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body('order_id') orderId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
          new FileTypeValidator({ fileType: /\.(jpg|jpeg|png)$/ }),
        ],
      }),
    )
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

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('cancel')
  cancelOrder(@GetUser() user, @Body('order_id') orderId: string) {
    return this.orderService.cancelOrder(user.id, orderId);
  }
}
