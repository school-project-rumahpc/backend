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

  // load user carts
  async getUserCart(userId: string) {
    const carts = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['item', 'user'],
      order: { createdAt: 'DESC' },
    });
    return carts;
  }

  // Add to cart
  async addToCart(productId: string, userId: string) {
    const cartItems = await this.getAllCarts();
    const product = await this.productService.findOne(productId);
    const user = await this.userService.findById(userId);

    // check if product is exist
    if (product) {
      // check if user has item in cart
      const cart = cartItems.filter(
        (cart) => cart.item.id === productId && cart.user.id === userId,
      );

      if (!cart) throw new NotFoundException('Cart not found!');

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

        // check stock of product
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

  // Calculate Total Price Carts
  async calculateCarts(userId: string) {
    const { carts } = await this.userService.findById(userId);

    const totalPrice = carts
      .map((cart) => cart.subTotal)
      .reduce((prev, curr) => prev + curr, 0);

    return totalPrice;
  }

  // remove cart (-1 quantity)
  async removeCart(productId: string, userId: string) {
    const cartItems = await this.getAllCarts();
    const product = await this.productService.findOne(productId);

    // check if product exist
    if (product) {
      // check cart in user
      const cart = cartItems.find(
        (cart) => cart.item.id === productId && cart.user.id === userId,
      );

      if (!cart) throw new NotFoundException('Cart not found!');

      const quantity = (cart.quantity -= 1);

      if (quantity === 0) await this.cartRepository.remove(cart);

      const subTotal = cart.item.price * quantity;

      // update cart
      await this.cartRepository.update({ id: cart.id }, { quantity, subTotal });

      return { message: 'Remove cart success!' };
    }

    return null;
  }

  // remove cart by id
  async removeCartById(id: number, userId: string) {
    const cart = await this.getCartById(id);

    if (cart.user['id'] == userId) {
      await this.cartRepository.remove(cart);

      return {
        message: 'Cart successfully deleted!',
      };
    }
  }

  // remove all user's carts
  async clearCarts(userId: string) {
    const user = await this.userService.findById(userId);
    const userCarts = user.carts;

    await this.cartRepository.remove(userCarts);

    return {
      message: "All User's cart successfully deleted!",
    };
  }
}
