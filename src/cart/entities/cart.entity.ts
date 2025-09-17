import {Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Product} from "../../products/entities/product.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.cart)
  user: User;

  @JoinTable()
  @ManyToMany(() => Product, product => product.carts)
  products: Product[];
}
