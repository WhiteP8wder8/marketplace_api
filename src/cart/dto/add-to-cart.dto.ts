import {IsInt, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddToCartDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  quantify: number;
}
