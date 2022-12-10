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
import { diskStorage } from 'multer';
import * as path from 'path';
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
  getAllOrders(@Query('deleted') deleted: string) {
    return this.orderService.getAllOrder(deleted);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOneOrder(@Param('id') id: string, @GetUser() user) {
    return this.orderService.getOrderById(id, user.id);
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const newFileName = `${req.body.order_id}${ext}`;
          cb(null, newFileName);
        },
      }),
    }),
  )
  uploadImage(
    @Body('order_id') orderId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.orderService.uploadOrderImage(orderId, file.path);
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
