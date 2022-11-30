import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllCart() {
    return this.cartService.getAllCarts();
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('add')
  addProductToCart(@GetUser() user, @Body() { product_id }: CartDto) {
    return this.cartService.addToCart(product_id, user.id);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('remove')
  removeCart(@GetUser() user, @Body('product_id') productId: string) {
    return this.cartService.removeCart(productId, user.id);
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('delete')
  removeCartById(
    @GetUser() user,
    @Body('cart_id', ParseIntPipe) cartId: number,
  ) {
    return this.cartService.removeCartById(cartId, user.id);
  }
}
