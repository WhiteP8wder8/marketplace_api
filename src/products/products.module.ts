import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Product} from "./entities/product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
