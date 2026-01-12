import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      mockService.getAll.mockResolvedValue(['cat1', 'cat2']);
      const result = await controller.getAll();
      expect(result).toEqual(['cat1', 'cat2']);
    });
  });

  describe('getOne', () => {
    it('should return a category', async () => {
      mockService.getOne.mockResolvedValue({ id: 1, name: 'Cat' });
      const result = await controller.getOne(1);
      expect(result).toEqual({ id: 1, name: 'Cat' });
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      mockService.createCategory.mockResolvedValue({ message: 'category was successfully created!' });
      const dto = { name: 'New Cat' };
      const result = await controller.createCategory(dto);
      expect(result).toEqual({ message: 'category was successfully created!' });
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      mockService.updateCategory.mockResolvedValue({ message: 'Category was successfully updated!' });
      const dto = { name: 'Updated Cat' };
      const result = await controller.updateCategory(dto, 1);
      expect(result).toEqual({ message: 'Category was successfully updated!' });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      mockService.deleteCategory.mockResolvedValue({ message: 'Category was successfully deleted' });
      const result = await controller.deleteCategory(1);
      expect(result).toEqual({ message: 'Category was successfully deleted' });
    });
  });
});
