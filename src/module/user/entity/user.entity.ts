import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/module/cart/entity/cart.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
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
  role: Role[];

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

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
