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
