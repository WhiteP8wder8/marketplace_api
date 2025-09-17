import {IsOptional, IsPositive} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class PaginationQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  offset: number;
}
