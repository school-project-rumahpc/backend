import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../order/order.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enum/role.enum';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllUser() {
    return this.userService.findAll();
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('carts')
  getUserCart(@GetUser() user) {
    return this.cartService.getUserCart(user.id);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('carts/total')
  getTotalPriceCart(@GetUser() user) {
    return this.cartService.calculateCarts(user.id);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('orders')
  getOrders(@GetUser() user, @Query('deleted') deleted: string) {
    return this.orderService.getUserOrder(user.id, deleted);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
<<<<<<< HEAD
=======
  @Patch('update')
  updateUser(@GetUser() user, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(user.id, dto);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
>>>>>>> e640825fe71eef8c75100d5ac2f93a3f0c65e580
  @Delete('carts')
  clearCarts(@GetUser() user) {
    return this.cartService.clearCarts(user.id);
  }
}
