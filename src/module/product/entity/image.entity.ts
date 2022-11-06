import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './product.entity';

@Entity({ name: 'product_images' })
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Products, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Products;
}
