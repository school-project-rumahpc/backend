import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) {}

  getAllCart() {
    return this.cartRepository.find();
  }

  async getCartById(id: number) {
    const cart = await this.cartRepository.findOneBy({ id });

    if (!cart) throw new NotFoundException('Cart not found!');

    return cart;
  }
}
