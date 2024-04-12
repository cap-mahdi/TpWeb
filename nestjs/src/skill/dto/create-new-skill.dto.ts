import { IsString } from 'class-validator';

export class CreatedNewSkillDto {
  @IsString()
  designation: string;
}
