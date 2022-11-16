import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const carts = await this.cartRepository.find({
      relations: ['item', 'user'],
    });

    try {
      return carts;
    } catch (err) {
      throw err;
    }
  }

  async getCartById(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    try {
      return cart;
    } catch (err) {
      throw new NotFoundException('Cart not found!');
    }
  }

  async getUserCart(userId: string) {
    const carts = await this.cartRepository.find({
      relations: ['item', 'user'],
      order: { createdAt: 'DESC' },
    });
    return carts.filter((cart) => {
      cart.user.id === userId;
      delete cart.user;
      return cart;
    });
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
        const stock = cart[0].item.stock;
        // Update item quantity
        const quantity = (cart[0].quantity += 1);
        if (quantity > stock) {
          throw new BadRequestException('Sorry, insufficient stock!');
        }
        const subTotal = cart[0].item.price * quantity;

        await this.cartRepository.update(cart[0].id, {
          quantity,
          subTotal,
        });

        return cart[0];
      }
    }

    return null;
  }

  async removeCartById(id: number, userId: string) {
    const cart = await this.getCartById(id);

    if (cart.user['id'] == userId) {
      await this.cartRepository.remove(cart);

      return {
        message: 'Cart succesfully deleted!',
      };
    }
  }
}
