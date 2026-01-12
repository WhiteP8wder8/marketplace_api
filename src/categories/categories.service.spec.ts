import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      mockRepository.find.mockResolvedValue(['cat1', 'cat2']);
      const result = await service.getAll();
      expect(result).toEqual(['cat1', 'cat2']);
    });
  });

  describe('getOne', () => {
    it('should return a category if found', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1, name: 'Cat' });
      const result = await service.getOne(1);
      expect(result).toEqual({ id: 1, name: 'Cat' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.getOne(1)).rejects.toThrow('Category with id 1 not found');
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      mockRepository.save.mockResolvedValue({});
      const result = await service.createCategory({ name: 'New Cat' });
      expect(result).toEqual({ message: 'category was successfully created!' });
    });
  });

  describe('updateCategory', () => {
    it('should update category if exists', async () => {
      mockRepository.preload.mockResolvedValue({});
      mockRepository.save.mockResolvedValue({});
      const result = await service.updateCategory({ name: 'Updated Cat' }, 1);
      expect(result).toEqual({ message: 'Category was successfully updated!' });
    });

    it('should throw NotFoundException if not exists', async () => {
      mockRepository.preload.mockResolvedValue(null);
      await expect(service.updateCategory({ name: 'Updated' }, 1)).rejects.toThrow('Category does not exist');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category if exists', async () => {
      mockRepository.findOne.mockResolvedValue({});
      mockRepository.remove.mockResolvedValue({});
      const result = await service.deleteCategory(1);
      expect(result).toEqual({ message: 'Category was successfully deleted' });
    });

    it('should throw NotFoundException if not exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteCategory(1)).rejects.toThrow('Category does not exist');
    });
  });
});
