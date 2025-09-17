import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Category} from "../../categories/entities/category.entity";
import {Cart} from "../../cart/entities/cart.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column('decimal')
  price: number;
  @Column('text', { array: true })
  tags: string[];
  @ManyToOne(() => Category, category => category.products, { eager: true, onDelete: 'SET NULL' })
  category: Category;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({name: 'ownerId'})
  ownerId: User;

  @ManyToMany(() => User, user => user.wishlist)
  wishlistId: User[];

  @ManyToMany(() => Cart, cart => cart.products)
  carts: Cart[];
}
