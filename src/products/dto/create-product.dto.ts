import {IsArray, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsArray()
  @IsString({each: true})
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
