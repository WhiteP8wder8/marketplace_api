import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Cart} from "./entities/cart.entity";
import {Repository} from "typeorm";
import {User} from "../users/entities/user.entity";
import {Product} from "../products/entities/product.entity";
import {AddToCartDto} from "./dto/add-to-cart.dto";
import e from "express";


@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
  }

  async getCart(userId: number) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['cart', 'cart.products']});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cart = user.cart;

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const PriceOfAll = cart.products?.reduce((sum, p) => sum + Number(p.price), 0) || 0;

    return {cart, PriceOfAll};
  }

  async addToCart(addToCartDto: AddToCartDto, userId: number) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['cart', 'cart.products']});

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const product = await this.productRepository.findOne({where: {id: addToCartDto.productId}});

    if (!product) {
      throw new NotFoundException('Product not exist');
    }

    let cart = user.cart;

    if (!cart) {
      cart = new Cart()
      cart.user = user;
      cart.products = [product];
    } else {
      if (!cart.products) {
        cart.products = [];
      }
      cart.products.push(product);
    }

    await this.cartRepository.save(cart);

    return {message: `${product.title} was added to your cart`};
  }

  async deleteFromCart(productId: number, userId: number) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['cart', 'cart.products']});

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const cart = user.cart;

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      throw new NotFoundException('Product not exist in cart');
    }

    cart.products.splice(productIndex, 1);

    await this.cartRepository.save(cart)

    return {message: 'Product successfully deleted from your cart'};
  }

  async deleteAllFromCart(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart', 'cart.products'] });

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const cart = user.cart;

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.products = [];

    await this.cartRepository.save(cart);

    return { message: 'Your cart successfully cleared' };
  }
}
