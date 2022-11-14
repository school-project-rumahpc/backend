import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './../product/entity/product.entity';
import { ProductService } from './../product/product.service';
import { Cart } from './entity/cart.entity';
import { Item } from './entity/item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private productService: ProductService,
  ) {}

  getAllCart() {
    return this.cartRepository.find();
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
    });

    try {
      return cart;
    } catch (err) {
      throw new NotFoundException('Cart not found');
    }
  }

  async createCart(userId: string) {
    const newCart = this.cartRepository.create({
      userId,
    });

    return await this.cartRepository.save(newCart);
  }

  async createItem(product: Products) {
    const newItem = this.itemRepository.create({ product });

    return await this.itemRepository.save(newItem);
  }

  async deleteCart(userId: string) {
    const cart = await this.getCart(userId);

    await this.cartRepository.remove(cart);

    return {
      message: 'Cart has been deleted',
    };
  }
}
