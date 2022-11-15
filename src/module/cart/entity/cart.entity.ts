import { Products } from 'src/module/product/entity';
import { User } from 'src/module/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Products, (products) => products.carts)
  @JoinColumn({ name: 'product_id' })
  item: Products;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: 0 })
  subTotal: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
