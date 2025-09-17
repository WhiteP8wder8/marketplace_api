import {Body, Controller, Delete, Get, Param, Post, Req} from '@nestjs/common';
import {CartService} from './cart.service';
import {AddToCartDto} from "./dto/add-to-cart.dto";
import {Request} from "express";
import {REQUEST_USER_KEY} from "../iam/constants/iam.constants";
import {Auth} from "../iam/authentication/decorators/auth.decorator";
import {AuthType} from "../iam/authentication/enums/auth-type.enum";

@Auth(AuthType.Bearer)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() request: Request) {
    const userId: number = request[REQUEST_USER_KEY].sub;
    return this.cartService.getCart(userId);
  }

  @Post()
  async addToCart(@Body() addToCartDto: AddToCartDto, @Req() request: Request) {
    const userId: number = request[REQUEST_USER_KEY].sub;
    return this.cartService.addToCart(addToCartDto, userId);
  }

  @Delete(':id')
  async deleteFromCart(@Param('id') id: number, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].sub;
    return this.cartService.deleteFromCart(id, userId);
  }

  @Delete()
  async deleteAllFromCart(@Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].sub;
    return this.cartService.deleteAllFromCart(userId);
  }
}
