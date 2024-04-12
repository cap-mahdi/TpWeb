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
import { CvService } from './cv.service';
import { Cv } from 'src/entities';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { UpdateCvDto } from './dto/Update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  async getAllCv(): Promise<Cv[]> {
    return this.cvService.findAll();
  }

  @Get(':id')
  async getCvById(@Param('id', ParseIntPipe) id: number): Promise<Cv> {
    return this.cvService.findOne(id);
  }
  @Post()
  async createCv(@Body() NewCv: CreateNewCvDto): Promise<Cv> {
    return await this.cvService.create(NewCv);
  }

  @Patch(':id')
  async updateCv(
    @Body() updatecv: UpdateCvDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.cvService.update(id, updatecv);
  }

  @Delete(':id')
  async deleteCv(@Param('id', ParseIntPipe) id: number) {
    return await this.cvService.remove(id);
  }

  @Post('/:cvId/:skillId')
  async addSKill(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Cv> {
    return await this.cvService.addSKill(cvId, skillId);
  }
}
