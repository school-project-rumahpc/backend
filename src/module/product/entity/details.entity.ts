import { Products } from './product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product_details' })
export class Details {
  @PrimaryColumn()
  id: string;

  @Column()
  processor: string;

  @Column({ nullable: true })
  motherboard: string;

  @Column()
  memory: string;

  @Column()
  storage: string;

  @Column({ nullable: true })
  graphics: string;

  @Column({ nullable: true })
  psu: string;

  @Column({ nullable: true })
  display: string;

  @Column({ nullable: true })
  casing: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToOne(() => Products, (product) => product.details, {
    onDelete: 'CASCADE',
  })
  product: Products;
}
