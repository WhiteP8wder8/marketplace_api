import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import {UsersRole} from "../users/enums/users-role.enum";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Product} from "./entities/product.entity";
import {User} from "../users/entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductsRepo: Partial<Repository<Product>>;
  let mockUsersRepo: Partial<Repository<User>>;

  beforeEach(async () => {
    const mockQueryBuilder: Partial<SelectQueryBuilder<Product>> = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    mockProductsRepo = {
      save: jest.fn().mockImplementation(product =>
          Promise.resolve({ id: 1, ...product }),
      ),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder as SelectQueryBuilder<Product>),
    };

    mockUsersRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test User', wishlist: [] }),
      save: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockProductsRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createProduct should save a product', async () => {
    const dto = { title: 'Test Product', price: 10 } as any;
    const userId = 1;

    const product = await service.createProduct(dto, userId);

    expect(product.id).toBe(1);
    expect(product.title).toBe(dto.title);
    expect(mockProductsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dto.title,
          price: dto.price,
          ownerId: { id: userId },
        }),
    );
  });

  it('filterProducts should call createQueryBuilder and return empty array', async () => {
    const filterDto = { search: 'abc' } as any;
    const paginationDto = { limit: 10, offset: 0 };

    const result = await service.filterProducts(filterDto, paginationDto);

    expect(result).toEqual([]);
    expect(mockProductsRepo.createQueryBuilder).toHaveBeenCalled();
  });
});
