import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getAllCart() {
    return this.cartService.getAllCarts();
  }

  @UseGuards(JwtGuard)
  @Post('add')
  addProductToCart(@GetUser() user, @Body('product_id') productId: string) {
    const userId = user['id'];

    return this.cartService.addToCart(productId, user);
  }
}
