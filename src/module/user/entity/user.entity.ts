import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/module/cart/entity/cart.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: Role, default: [Role.USER] })
  roles: Role[];

  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
