import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "../products/entities/product.entity";
import {Category} from "./entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
