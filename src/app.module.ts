import 'dotenv/config'
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { IamModule } from './iam/iam.module';
import {ConfigModule} from "@nestjs/config";
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,
  }), UsersModule, ProductsModule, IamModule, CategoriesModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
