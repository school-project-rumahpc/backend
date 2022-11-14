import { Products } from 'src/module/product/entity';
import { BeforeInsert, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cart_items' })
export class Item {
  @PrimaryColumn()
  productId: string;

  @OneToOne(() => Products)
  product: Products;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: 0 })
  subTotal: number;

  @BeforeInsert()
  inserProductId() {
    this.productId = this.product.id;
  }
}
