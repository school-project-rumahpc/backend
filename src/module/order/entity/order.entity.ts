import { User } from 'src/module/user/entity/user.entity';
import {
  BeforeInsert,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryColumn({ type: 'string' })
  id: string;

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'order_date', type: 'timestamptz' })
  orderDate: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    const d = new Date();
    const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('');
    const hour = [d.getHours(), d.getMinutes(), d.getSeconds()].join('');
    const userId = this.user.id.split('-')[0];

    this.id = [date, hour, userId].join('-');
  }
}
