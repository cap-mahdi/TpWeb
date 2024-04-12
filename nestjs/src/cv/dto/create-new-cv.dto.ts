import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNewCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @IsNotEmpty()
  cin: number;

  @IsString()
  @IsNotEmpty()
  job: string;

  @IsString()
  @IsOptional()
  path: string;
}
