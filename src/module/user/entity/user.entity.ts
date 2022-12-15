import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/module/cart/entity/cart.entity';
import { Order } from 'src/module/order/entity/order.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, default: [Role.USER] })
  role: Role;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Cart, (cart) => cart.user, { onDelete: 'SET NULL' })
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user, { onDelete: 'SET NULL' })
  orders: Order[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
