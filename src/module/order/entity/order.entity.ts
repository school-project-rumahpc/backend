import { Cart } from 'src/module/cart/entity/cart.entity';
import { User } from 'src/module/user/entity/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enum/status.enum';
import { Payment } from './payment.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('jsonb')
  items: Cart[];

  @Column({ type: 'enum', enum: Status, default: Status.WAITING })
  status: Status;

  @Column({ name: 'total_price' })
  totalPrice: number;

  @Column({ nullable: true, type: 'timestamptz' })
  deadline: Date;

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @CreateDateColumn({ name: 'order_date', type: 'timestamptz' })
  orderDate: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;

  @BeforeInsert()
  generateId() {
    const d = new Date();
    const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('');
    const hour = [d.getHours(), d.getMinutes(), d.getSeconds()].join('');
    const userId = this.user.id;

    this.id = [date, hour, userId].join('-');
  }

  @BeforeInsert()
  setDeadline() {
    const d = new Date();
    const date = d.getDate() + 1;
    d.setDate(date);

    this.deadline = d;
  }
}
