import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import {REQUEST_USER_KEY} from "../iam/constants/iam.constants";

describe('CartController', () => {
  let controller: CartController;
  let cartService: Partial<CartService>;

  beforeEach(async () => {
    cartService = {
      getCart: jest.fn(),
      addToCart: jest.fn(),
      deleteFromCart: jest.fn(),
      deleteAllFromCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CartService, useValue: cartService },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCart should call CartService.getCart', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 1 } };
    await controller.getCart(req);
    expect(cartService.getCart).toHaveBeenCalledWith(1);
  });

  it('addToCart should call CartService.addToCart', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 1 } };
    const dto = { productId: 2, quantity: 3 };
    await controller.addToCart(dto as any, req);
    expect(cartService.addToCart).toHaveBeenCalledWith(dto, 1);
  });

  it('deleteFromCart should call CartService.deleteFromCart', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 1 } };
    await controller.deleteFromCart(5, req);
    expect(cartService.deleteFromCart).toHaveBeenCalledWith(5, 1);
  });

  it('deleteAllFromCart should call CartService.deleteAllFromCart', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 1 } };
    await controller.deleteAllFromCart(req);
    expect(cartService.deleteAllFromCart).toHaveBeenCalledWith(1);
  });
});
