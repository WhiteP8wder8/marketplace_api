import {IsEmail, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @MinLength(3)
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @MinLength(10)
  password: string;
}
