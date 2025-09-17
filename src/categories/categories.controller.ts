import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CategoriesService} from './categories.service';
import {Roles} from "../iam/authorization/decorators/roles.decorator";
import {UsersRole} from "../users/enums/users-role.enum";
import {RolesGuard} from "../iam/authorization/guards/roles/roles.guard";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {
  }

  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.categoriesService.getOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UsersRole.Admin)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UsersRole.Admin)
  @Patch(':id')
  async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto, @Param('id') id: number) {
    return this.categoriesService.updateCategory(updateCategoryDto, id);
  }

  @UseGuards(RolesGuard)
  @Roles(UsersRole.Admin)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
