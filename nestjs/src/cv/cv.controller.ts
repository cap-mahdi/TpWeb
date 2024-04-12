import { Controller, UploadedFile, UseInterceptors, Post, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { join } from 'path';

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
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from 'src/entities';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { UpdateCvDto } from './dto/Update-cv.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { User } from 'src/entities';

@Controller('cv')
export class CvController {
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  hello(@GetUser() user: User): string {
    console.log('from controller : ', user);
    return 'hello';
  }

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
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadImage(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ })
                .addMaxSizeValidator({ maxSize: 1024 * 1024 })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
        ) file) {

        const fileName = file.originalname;
        const filePath = join(process.cwd(), 'public', fileName)

        try {
            await fs.writeFile(filePath, file.buffer);
            return { success: true, message: 'File uploaded successfully.' }
        } catch (error) {
            return { success: false, message: 'Failed to upload file.' }
        }
    }
}
