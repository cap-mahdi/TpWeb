import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from 'src/entities';
import { CreatedNewSkillDto } from './dto/create-new-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async getAllSkill(): Promise<Skill[]> {
    return await this.skillService.findAll();
  }

  @Get(':id')
  async getSkillById(@Param('id', ParseIntPipe) id: number): Promise<Skill> {
    return await this.skillService.findOne(id);
  }

  @Post()
  async createSkill(@Body() skill: CreatedNewSkillDto): Promise<Skill> {
    return await this.skillService.create(skill);
  }

  @Patch(':id')
  async updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkill: CreatedNewSkillDto,
  ): Promise<Skill> {
    return await this.skillService.update(id, updateSkill);
  }

  @Delete(':id')
  async deleteSkill(@Param('id', ParseIntPipe) id: number): Promise<Skill> {
    return await this.skillService.remove(id);
  }
}
