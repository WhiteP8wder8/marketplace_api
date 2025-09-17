import {Body, Controller, Delete, Get, Param, Patch, Req, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {Request} from "express";
import {REQUEST_USER_KEY} from "../iam/constants/iam.constants";
import {Auth} from "../iam/authentication/decorators/auth.decorator";
import {AuthType} from "../iam/authentication/enums/auth-type.enum";
import {UpdateUserDto} from "./dto/update-user.dto";
import {RolesGuard} from "../iam/authorization/guards/roles/roles.guard";
import {UsersRole} from "./enums/users-role.enum";
import {Roles} from "../iam/authorization/decorators/roles.decorator";
import {AdminUpdateUserDto} from "./dto/admin-update-user.dto";

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @UseGuards(RolesGuard)
  @Roles(UsersRole.Admin)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(RolesGuard)
  @Roles(UsersRole.Admin)
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UsersRole.Admin)
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() adminUpdateUserDto: AdminUpdateUserDto) {
    return this.usersService.updateUser(id, adminUpdateUserDto);
  }

  @Get('me')
  async getMe(@Req() request: Request) {
    const userId: number = request[REQUEST_USER_KEY].sub;
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  async changeMe(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId: number = request[REQUEST_USER_KEY].sub;
    return this.usersService.changeMe(updateUserDto, userId);
  }
}
