import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {Repository} from "typeorm";
import {getRawAsset} from "node:sea";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
  }

  getAll() {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async getOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id: id }, relations: ['products'] });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new Category();
      category.name = createCategoryDto.name

      await this.categoryRepository.save(category);
      return { message: 'category was successfully created!' }
    } catch (e) {
      throw new BadRequestException('Failed to create category');
    }
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto, id: number) {
    const category = await this.categoryRepository.preload({ id: id, ...updateCategoryDto });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    await this.categoryRepository.save(category);

    return { message: 'Category was successfully updated!' };
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id: id } });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    await this.categoryRepository.remove(category);

    return { message: 'Category was successfully deleted' }
  }
}
