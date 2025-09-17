import {UsersRole} from "../enums/users-role.enum";
import {IsEmail, IsEnum, IsOptional, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AdminUpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  name?: string;
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
  @ApiProperty()
  @IsOptional()
  @MinLength(10)
  password?: string;
  @ApiProperty()
  @IsOptional()
  @IsEnum(UsersRole)
  role?: UsersRole;
}
