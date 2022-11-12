import { Products } from 'src/module/product/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'category', orderBy: { id: 'ASC' } })
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  category_name: string;

  @OneToMany(() => Products, (products) => products.category)
  products: Products[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
