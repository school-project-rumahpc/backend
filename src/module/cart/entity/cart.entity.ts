import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './../../user/entity/user.entity';

@Entity({ name: 'cart', orderBy: { created_at: 'DESC' } })
export class Cart {
  @PrimaryColumn()
  userId: string;

  @Column({ name: 'total_price', type: 'bigint', default: 0 })
  totalPrice: number;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
