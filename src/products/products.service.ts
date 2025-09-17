import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {User} from "../users/entities/user.entity";
import {UpdateProductDto} from "./dto/update-product.dto";
import {UsersRole} from "../users/enums/users-role.enum";
import {PaginationQueryDto} from "./dto/pagination-query.dto";
import {Category} from "../categories/entities/category.entity";
import {FilterProductDto} from "./dto/filter-product.dto";


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  getAll(paginationQueryDto: PaginationQueryDto) {
    const {limit, offset} = paginationQueryDto;
    return this.productsRepository.find({relations: ['ownerId'], skip: offset, take: limit});
  }

  async getOne(id: number) {
    try {
      return await this.productsRepository.findOne({where: {id}, relations: ['owner']});
    } catch (e) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async createProduct(createProductDto: CreateProductDto, id: number) {
    try {
      const product = new Product();
      product.title = createProductDto.title;
      product.description = createProductDto.description;
      product.price = createProductDto.price;
      product.tags = createProductDto.tags;
      product.ownerId = {id} as User;

      if (createProductDto.categoryId) {
        product.category = {id: createProductDto.categoryId} as Category;
      }

      await this.productsRepository.save(product);

      return product;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateProduct(updateProductDto: UpdateProductDto, ownerId: number, role: string, productId: number) {
    const product = await this.productsRepository.findOne({where: {id: productId}, relations: ['ownerId']});

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (updateProductDto.categoryId) {
      product.category = {id: updateProductDto.categoryId} as Category;
    }

    if (product.ownerId.id !== ownerId && role !== UsersRole.Admin) {
      throw new UnauthorizedException('This is not your product');
    }

    Object.assign(product, updateProductDto);

    return this.productsRepository.save(product);
  }

  async deleteProduct(productId: number, role: string, ownerId: number) {
    const product = await this.productsRepository.findOne({where: {id: productId}, relations: ['ownerId']});

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (product?.ownerId.id !== ownerId && role !== UsersRole.Admin) {
      throw new UnauthorizedException('You cannot delete this product');
    }

    await this.productsRepository.remove(product);

    return {message: `Product with id ${productId} deleted successfully`};
  }

  async filterProducts(filterProductDto: FilterProductDto, paginationQueryDto: PaginationQueryDto) {
    const {search, minPrice, maxPrice, categoryId} = filterProductDto;
    const {limit, offset} = paginationQueryDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.ownerId', 'ownerId')
      .skip(offset)
      .take(limit);

    if (search) {
      query.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search)',
        {search: `%${search}%`},
      );
    }

    if (minPrice) {
      query.andWhere('product.price >= :minPrice', {minPrice});
    }

    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', {maxPrice});
    }

    if (categoryId) {
      query.andWhere('category.id = :categoryId', {categoryId});
    }

    return query.getMany();
  }

  async addToWishlist(userId: number, productId: number) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['wishlist']});

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const product = await this.productsRepository.findOne({where: {id: productId}});

    if (!product) {
      throw new NotFoundException('Product not exist');
    }

    user.wishlist.push(product);

    await this.userRepository.save(user);

    return {message: `Product ${product.title} was added to your wishlist`};
  }

  async removeFromWishlist(userId: number, productId: number) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['wishlist']});

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const product = await this.productsRepository.findOne({where: {id: productId}});

    if (!product) {
      throw new NotFoundException('Product not exist');
    }

    if (!user.wishlist || user.wishlist.length === 0) {
      throw new NotFoundException('Wishlist is empty');
    }

    const hasProduct = user.wishlist.find((p) => p.id === product.id);
    if (!hasProduct) {
      throw new NotFoundException('Product not found in wishlist');
    }

    user.wishlist = user.wishlist.filter((p) => p.id !== product.id);

    await this.userRepository.save(user);

    return { message: `Product ${product.title} was removed from your wishlist` }
  }
}
