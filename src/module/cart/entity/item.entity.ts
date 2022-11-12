import { Products } from 'src/module/product/entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cart_items' })
export class Item {
  @PrimaryColumn()
  productId: string;

  @Column()
  qty: number;

  @Column({ name: 'sub_total' })
  subTotal: number;

  @OneToOne(() => Products)
  product: Products;
}
