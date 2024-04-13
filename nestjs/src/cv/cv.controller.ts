import { FileInterceptor } from '@nestjs/platform-express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from '../entities';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { UpdateCvDto } from './dto/Update-cv.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../entities';
import { PaginationCvDto } from './dto/pagination-cv.dto';
import { CvCriteriaDto } from './dto/get-cv-criteria.dto';

@Controller('cv')
@UseGuards(AuthGuard('jwt'))
export class CvController {
  constructor(private readonly cvService: CvService) {}
  @Get()
  async getAllCv(
    @GetUser() user: User,
    @Query() { limit, page }: PaginationCvDto,
    @Query() { age, criteria }: CvCriteriaDto,
  ): Promise<Cv[]> {
    return this.cvService.findAll(user, page, limit, age, criteria);
  }

  @Get(':id')
  async getCvById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Cv> {
    return this.cvService.findOne(id, user);
  }

  @Post()
  async createCv(
    @GetUser() user: User,
    @Body() NewCv: CreateNewCvDto,
  ): Promise<Cv> {
    return await this.cvService.createCv(NewCv, user);
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

  @Patch('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cvService.uploadPhoto(id, file);
  }

  @Post('/:cvId/:skillId')
  async addSKill(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Cv> {
    return await this.cvService.addSKill(cvId, skillId);
  }
}
