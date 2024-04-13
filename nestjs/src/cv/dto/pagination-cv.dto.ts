import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationCvDto {
  @IsNumber()
  @Type(() => Number)
  readonly page: number = 1;

  @IsNumber()
  @Type(() => Number)
  readonly limit: number = 10;
}
