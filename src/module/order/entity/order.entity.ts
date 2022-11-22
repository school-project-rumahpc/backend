import { User } from 'src/module/user/entity/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enum/status.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('jsonb')
  items: object[];

  @Column({ type: 'enum', enum: Status, default: Status.WAITING })
  status: Status;

  @Column({ name: 'total_price' })
  totalPrice: number;

  @Column({ nullable: true, type: 'timestamptz' })
  deadline: Date;

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
