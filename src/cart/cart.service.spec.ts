import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import {NotFoundException} from "@nestjs/common";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Cart} from "./entities/cart.entity";
import {User} from "../users/entities/user.entity";
import {Product} from "../products/entities/product.entity";

describe('CartService', () => {
  let service: CartService;

  const mockCartRepository = {
    save: jest.fn(),
  };
  const mockUserRepository = {
    findOne: jest.fn(),
  };
  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.getCart(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if cart not found', async () => {
      mockUserRepository.findOne.mockResolvedValue({ cart: null });
      await expect(service.getCart(1)).rejects.toThrow(NotFoundException);
    });

    it('should return cart with total price', async () => {
      const cart = { products: [{ price: 10 }, { price: 5 }] };
      mockUserRepository.findOne.mockResolvedValue({ cart });
      const result = await service.getCart(1);
      expect(result.PriceOfAll).toBe(15);
      expect(result.cart).toEqual(cart);
    });
  });

  describe('addToCart', () => {
    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.addToCart({ productId: 1, quantify: 1 }, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if product not found', async () => {
      mockUserRepository.findOne.mockResolvedValue({ cart: { products: [] }, id: 1 });
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.addToCart({ productId: 1, quantify: 1 }, 1)).rejects.toThrow(NotFoundException);
    });

    it('should add product to cart', async () => {
      const user = { cart: { products: [] }, id: 1 };
      const product = { id: 2, title: 'P1' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockProductRepository.findOne.mockResolvedValue(product);
      mockCartRepository.save.mockResolvedValue(user.cart);

      const result = await service.addToCart({ productId: 2, quantify: 1 }, 1);
      expect(result).toEqual({ message: 'P1 was added to your cart' });
      expect(user.cart.products).toContain(product);
    });
  });

  describe('deleteFromCart', () => {
    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteFromCart(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if cart not found', async () => {
      mockUserRepository.findOne.mockResolvedValue({ cart: null });
      await expect(service.deleteFromCart(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if product not in cart', async () => {
      mockUserRepository.findOne.mockResolvedValue({ cart: { products: [{ id: 2 }] } });
      await expect(service.deleteFromCart(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should remove product from cart', async () => {
      const cart = { products: [{ id: 1 }, { id: 2 }] };
      const user = { cart };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockCartRepository.save.mockResolvedValue(cart);

      const result = await service.deleteFromCart(1, 1);
      expect(result).toEqual({ message: 'Product successfully deleted from your cart' });
      expect(cart.products).toHaveLength(1);
      expect(cart.products[0].id).toBe(2);
    });
  });

  describe('deleteAllFromCart', () => {
    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteAllFromCart(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if cart not found', async () => {
      mockUserRepository.findOne.mockResolvedValue({ cart: null });
      await expect(service.deleteAllFromCart(1)).rejects.toThrow(NotFoundException);
    });

    it('should clear cart', async () => {
      const cart = { products: [{ id: 1 }, { id: 2 }] };
      const user = { cart };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockCartRepository.save.mockResolvedValue(cart);

      const result = await service.deleteAllFromCart(1);
      expect(result).toEqual({ message: 'Your cart successfully cleared' });
      expect(cart.products).toHaveLength(0);
    });
  });
});