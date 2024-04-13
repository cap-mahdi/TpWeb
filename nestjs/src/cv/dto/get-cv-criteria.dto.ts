import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CvCriteriaDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  age: number;

  @IsString()
  @IsOptional()
  criteria: string;
}
