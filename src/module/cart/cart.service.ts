import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async getAllCarts() {
    const carts = await this.cartRepository.find({ relations: ['item'] });

    try {
      return carts;
    } catch (err) {
      throw err;
    }
  }

  async addToCart(productId: string, userId: string) {
    const cartItems = await this.cartRepository.find({ relations: ['item'] });
    const product = await this.productService.findOne(productId);
    const authUser = await this.userService.findById(userId);

    // check if product is exist
    if (product) {
      // check if user has item in cart
      const cart = cartItems.filter(
        (item) => item.item.id === productId && item.user.id === userId,
      );
    }
  }
}
