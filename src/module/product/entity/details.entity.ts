import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './product.entity';

@Entity({ name: 'product_details', orderBy: { id: 'ASC' } })
export class Details {
  @Exclude()
  @PrimaryColumn()
  id: string;

  @Column()
  processor: string;

  @Column({ nullable: true, default: null })
  motherboard: string;

  @Column()
  memory: string;

  @Column()
  storage: string;

  @Column({ nullable: true, default: null })
  graphics: string;

  @Column({ nullable: true, default: null })
  psu: string;

  @Column({ nullable: true, default: null })
  display: string;

  @Column({ nullable: true, default: null })
  casing: string;

  @OneToOne(() => Products, (product) => product.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = `${this.product.id}D`;
  }
}
