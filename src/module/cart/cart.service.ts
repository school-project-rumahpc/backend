import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => UserService))
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

  async getUserCart(userId: string) {
    const carts = await this.getAllCarts();
    return carts.filter((cart) => cart.user.id === userId);
  }

  async addToCart(productId: string, userId: string) {
    const cartItems = await this.cartRepository.find({
      relations: ['item', 'user'],
    });
    const product = await this.productService.findOne(productId);
    const user = await this.userService.findById(userId);

    // check if product is exist
    if (product) {
      // check if user has item in cart
      const cart = cartItems.filter(
        (item) => item.item.id === productId && item.user.id === userId,
      );

      if (cart.length < 1) {
        const newItem = this.cartRepository.create({
          item: product,
          user,
          subTotal: product.price,
        });

        return await this.cartRepository.save(newItem);
      } else {
        // Update item quantity
        const quantity = (cart[0].quantity += 1);
        const subTotal = cart[0].subTotal * quantity;

        await this.cartRepository.update(cart[0].id, {
          quantity,
          subTotal,
        });

        return cart[0];
      }
    }

    return null;
  }
}
