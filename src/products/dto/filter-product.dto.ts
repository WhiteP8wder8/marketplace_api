import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class FilterProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minPrice?: number;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maxPrice?: number;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
