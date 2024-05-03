import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCvDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  firstName: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsNumber()
  @IsOptional()
  cin: number;

  @IsString()
  @IsOptional()
  job: string;

  @IsString()
  @IsOptional()
  path: string;
}
