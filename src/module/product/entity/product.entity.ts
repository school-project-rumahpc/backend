import { Cart } from 'src/module/cart/entity/cart.entity';
import { Category } from 'src/module/category/entity/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Details } from './details.entity';

@Entity({ name: 'products', orderBy: { id: 'ASC' } })
export class Products {
  @PrimaryColumn({ nullable: false, unique: true })
  id: string;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column('text', { array: true, default: [] })
  images: string[];

  @OneToOne(() => Details, (details) => details.product, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'details_id' })
  details: Details;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
  product: Details[];

  @OneToMany(() => Cart, (cart) => cart.item)
  carts: Cart[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
