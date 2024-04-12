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
  @UseGuards(AuthGuard('jwt'),
    // AdminGuard
  )
  @Get("hello")
  hello(@GetUser() user: User): string {
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCv(
    @GetUser() user: User,
    @Body() NewCv: CreateNewCvDto
  ): Promise<Cv> {
    console.log({ user });

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
