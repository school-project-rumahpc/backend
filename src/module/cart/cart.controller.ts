import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/custom-decorator/roles.decorator';
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

  @Get(':id')
  getCartById(@Param('id') id: number) {
    return this.cartService.getCartById(id);
  }

  @Roles(Role.USER)
  @Post('add/:id')
  addProductToCart(@Req() req: Request, @Param('id') id: string) {
    const user = req.user;
    const product = this.productService.findOne(id);

    return product;
  }
}
