import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Cart} from "./entities/cart.entity";
import {Product} from "../products/entities/product.entity";
import {User} from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
