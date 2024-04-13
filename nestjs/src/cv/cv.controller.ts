import { FileInterceptor } from '@nestjs/platform-express';

import { CvService } from './cv.service';
import { Cv } from '../entities';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { UpdateCvDto } from './dto/Update-cv.dto';

import { User } from '../entities';
import { CurrentUser } from 'src/decorators';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

@Controller('cv')
export class CvController {

  @Get("hello")
  hello(@CurrentUser() user: User): string {
    console.log('from controller : ', user);
    return 'hello';
  }

  constructor(private readonly cvService: CvService) { }

  @Get()
  async getAllCv(): Promise<Cv[]> {
    return this.cvService.findAll();
  }

  @Get(':id')
  async getCvById(@Param('id', ParseIntPipe) id: number): Promise<Cv> {
    return this.cvService.findOne(id);
  }

  @Post()
  async createCv(
    @CurrentUser() userId: number,
    @Body() NewCv: CreateNewCvDto
  ) {

    return await this.cvService.createCv(NewCv, userId);
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

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.cvService.uploadPhoto(id, file)
  }

  @Post('/:cvId/:skillId')
  async addSKill(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Cv> {
    return await this.cvService.addSKill(cvId, skillId);
  }

}
