import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/custom-decorator/roles.decorator';
import { JwtGuard } from '../auth/guard';
import { Role } from '../user/enum/role.enum';
import { ProductService } from './../product/product.service';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  getAll() {
    return this.cartService.getAllCart();
  }

  @UseGuards(JwtGuard)
  @Get()
  getCartById(@Req() req: Request) {
    const userId = req.user['id'];
    return this.cartService.getCartById(userId);
  }

  @Roles(Role.USER)
  @Post('add')
  addProductToCart(@Req() req: Request) {
    const user = req.user['id'];
  }
}
