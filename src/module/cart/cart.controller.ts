import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllCart() {
    return this.cartService.getAllCarts();
  }

  @UseGuards(JwtGuard)
  @Post('add')
  addProductToCart(@GetUser() user, @Body('product_id') productId: string) {
    const userId = user.id;

    return this.cartService.addToCart(productId, userId);
  }
}
