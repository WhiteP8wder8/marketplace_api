import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req} from '@nestjs/common';
import {ProductsService} from './products.service';
import {Auth} from "../iam/authentication/decorators/auth.decorator";
import {AuthType} from "../iam/authentication/enums/auth-type.enum";
import {CreateProductDto} from "./dto/create-product.dto";
import {REQUEST_USER_KEY} from "../iam/constants/iam.constants";
import {Request} from "express";
import {Roles} from "../iam/authorization/decorators/roles.decorator";
import {UsersRole} from "../users/enums/users-role.enum";
import {UpdateProductDto} from "./dto/update-product.dto";
import {PaginationQueryDto} from "./dto/pagination-query.dto";
import {FilterProductDto} from "./dto/filter-product.dto";

@Auth(AuthType.Bearer)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {
  }

  @Auth(AuthType.None)
  @Get()
  getAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.productsService.getAll(paginationQuery);
  }

  @Auth(AuthType.None)
  @Get('filter')
  async filterProducts(
    @Query() filterProductDto: FilterProductDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.productsService.filterProducts(filterProductDto, paginationQueryDto);
  }

  @Auth(AuthType.None)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.productsService.getOne(id);
  }

  @Roles(UsersRole.User)
  @Post('create-product')
  async createProduct(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].sub;
    return this.productsService.createProduct(createProductDto, userId);
  }

  @Roles(UsersRole.User)
  @Patch(':id')
  async updateProduct(@Body() updateProductDto: UpdateProductDto, @Req() request: Request, @Param('id') id: number) {
    const ownerId = request[REQUEST_USER_KEY].sub;
    const userRole = request[REQUEST_USER_KEY].role;

    return this.productsService.updateProduct(updateProductDto, ownerId, userRole, id);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number, @Req() request: Request) {
    const userRole = request[REQUEST_USER_KEY].role;
    const ownerId = request[REQUEST_USER_KEY].sub;
    return this.productsService.deleteProduct(id, userRole, ownerId);
  }

  @Post('wishlist/:id')
  async addToWishlist(@Param('id') productId: number, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].sub;
    return this.productsService.addToWishlist(userId, productId);
  }

  @Delete('wishlist/:id')
  async deleteFromWishlist(@Param('id') productId: number, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].sub;
    return this.productsService.removeFromWishlist(userId, productId);
  }
}
