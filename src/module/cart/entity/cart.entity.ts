import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './../../user/entity/user.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'bigint', default: 0 })
  total_price: number;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
