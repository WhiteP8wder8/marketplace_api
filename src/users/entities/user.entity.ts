import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersRole} from "../enums/users-role.enum";
import {Product} from "../../products/entities/product.entity";
import {Cart} from "../../cart/entities/cart.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({enum: UsersRole, default: UsersRole.User})
  role: UsersRole;

  @OneToMany(() => Product, (product) => product.ownerId)
  products: Product[]

  @JoinTable()
  @ManyToMany(() => Product, product => product.wishlistId)
  wishlist: Product[];

  @JoinColumn()
  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;
}
