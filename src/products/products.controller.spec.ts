import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {REQUEST_USER_KEY} from "../iam/constants/iam.constants";
import {UpdateProductDto} from "./dto/update-product.dto";
import {CreateProductDto} from "./dto/create-product.dto";
import {PaginationQueryDto} from "./dto/pagination-query.dto";
import {FilterProductDto} from "./dto/filter-product.dto";

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockProductsService: any;

  beforeEach(async () => {
    mockProductsService = {
      getAll: jest.fn(),
      getOne: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      filterProducts: jest.fn(),
      addToWishlist: jest.fn(),
      removeFromWishlist: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
        .overrideProvider(ProductsService)
        .useValue(mockProductsService)
        .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAll should call service.getAll with pagination', async () => {
    const pagination: PaginationQueryDto = { limit: 10, offset: 0 };
    mockProductsService.getAll.mockResolvedValue(['product1', 'product2']);

    const result = await controller.getAll(pagination);

    expect(result).toEqual(['product1', 'product2']);
    expect(mockProductsService.getAll).toHaveBeenCalledWith(pagination);
  });

  it('getOne should call service.getOne with id', async () => {
    mockProductsService.getOne.mockResolvedValue({ id: 1 });
    const result = await controller.getOne(1);
    expect(result).toEqual({ id: 1 });
    expect(mockProductsService.getOne).toHaveBeenCalledWith(1);
  });

  it('filterProducts should call service.filterProducts with DTOs', async () => {
    const filterDto: FilterProductDto = { search: 'test' };
    const pagination: PaginationQueryDto = { limit: 10, offset: 0 };
    mockProductsService.filterProducts.mockResolvedValue(['filtered']);

    const result = await controller.filterProducts(filterDto, pagination);

    expect(result).toEqual(['filtered']);
    expect(mockProductsService.filterProducts).toHaveBeenCalledWith(filterDto, pagination);
  });

  it('createProduct should call service.createProduct with DTO and userId', async () => {
    const dto: CreateProductDto = {
      title: 'New Product',
      price: 100,
      description: 'Some description',
      tags: ['tag1', 'tag2'],
    };
    const req: any = { [REQUEST_USER_KEY]: { sub: 5 } };
    mockProductsService.createProduct.mockResolvedValue({ ...dto, id: 1 });

    const result = await controller.createProduct(dto, req);

    expect(result).toEqual({ ...dto, id: 1 });
    expect(mockProductsService.createProduct).toHaveBeenCalledWith(dto, 5);
  });

  it('updateProduct should call service.updateProduct with DTO, ownerId, role, and id', async () => {
    const dto: UpdateProductDto = {
      title: 'Updated Product',
      price: 120,
      description: 'Updated description',
      tags: ['tag3'],
    };
    const req: any = { [REQUEST_USER_KEY]: { sub: 2, role: 'User' } };
    mockProductsService.updateProduct.mockResolvedValue({ ...dto, id: 1 });

    const result = await controller.updateProduct(dto, req, 1);

    expect(result).toEqual({ ...dto, id: 1 });
    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(dto, 2, 'User', 1);
  });

  it('deleteProduct should call service.deleteProduct with id, role, ownerId', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 2, role: 'User' } };
    mockProductsService.deleteProduct.mockResolvedValue({ message: 'deleted' });

    const result = await controller.deleteProduct(1, req);

    expect(result).toEqual({ message: 'deleted' });
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1, 'User', 2);
  });

  it('addToWishlist should call service.addToWishlist with productId and userId', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 2 } };
    mockProductsService.addToWishlist.mockResolvedValue({ message: 'added' });

    const result = await controller.addToWishlist(1, req);

    expect(result).toEqual({ message: 'added' });
    expect(mockProductsService.addToWishlist).toHaveBeenCalledWith(2, 1);
  });

  it('deleteFromWishlist should call service.removeFromWishlist with productId and userId', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 2 } };
    mockProductsService.removeFromWishlist.mockResolvedValue({ message: 'removed' });

    const result = await controller.deleteFromWishlist(1, req);

    expect(result).toEqual({ message: 'removed' });
    expect(mockProductsService.removeFromWishlist).toHaveBeenCalledWith(2, 1);
  });
});
