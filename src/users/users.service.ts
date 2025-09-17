import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {HashingService} from "../iam/hashing/hashing.service";
import {AdminUpdateUserDto} from "./dto/admin-update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {
  }

  async getAll() {
    return await this.userRepository.find({ relations: { products: true, wishlist: true, cart: { products: true } } });
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }

  async updateUser(id: number, adminUpdateUserDto: AdminUpdateUserDto) {
    const user = await this.userRepository.preload({id: id, ...adminUpdateUserDto});

    if (!user) {
      throw new NotFoundException('User does not found');
    }

    if (adminUpdateUserDto.password) {
      user.password = await this.hashingService.hash(adminUpdateUserDto.password);
    }

    return this.userRepository.save(user);
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: {id: userId},
      select: ['name', 'email', 'role', 'products']
    });
    if (!user) {
      throw new NotFoundException('User does not found');
    }

    return user;
  }

  async changeMe(updateUserDto: UpdateUserDto, userId: number) {
    const user = await this.userRepository.preload({id: userId, ...updateUserDto});
    if (!user) {
      throw new UnauthorizedException();
    }

    if (updateUserDto.password) {
      user.password = await this.hashingService.hash(updateUserDto.password);
    }

    return this.userRepository.save(user);
  }
}
