import { Category } from 'src/module/category/entity/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Details } from './details.entity';

@Entity({ name: 'products' })
export class Products {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column()
  product_name: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToOne(() => Details, (details) => details.product)
  @JoinColumn({ name: 'details_id' })
  details: Details;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
  product: Details[];
}
