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
  Put,
  Sse,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv, UserRole, Action } from '../entities';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { UpdateCvDto } from './dto/Update-cv.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../entities';
import { PaginationCvDto } from './dto/pagination-cv.dto';
import { CvCriteriaDto } from './dto/get-cv-criteria.dto';
import { CvOwnerGuard } from '../auth/guards/cv-owner.guard';
import { Observable, filter, fromEvent, map, merge } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CVEvent } from 'src/common/events';
import { AdminGuard } from 'src/auth/guards/admin.guard';

function canTrack(user: User, cv: Cv): boolean {
  return user.role === UserRole.Admin || cv.user.id === user.id;
}
@Controller('cv')
@UseGuards(AuthGuard('jwt'))
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private eventEmitter: EventEmitter2,
  ) {}
  @Sse('sse')
  sse(@GetUser() user: User): Observable<MessageEvent> {
    const createEvent = fromEvent(this.eventEmitter, CVEvent.Add).pipe(
      filter(({ cv }) => {
        return canTrack(user, cv);
      }),
      map(({ cv }) => {
        return new MessageEvent(Action.CREATE, { data: cv });
      }),
    );

    const updateEvent = fromEvent(this.eventEmitter, CVEvent.Update).pipe(
      filter(({ cv }: any) => {
        return canTrack(user, cv);
      }),
      map(({ cv }) => {
        return new MessageEvent(Action.UPDATE, { data: cv });
      }),
    );

    const deleteEvent = fromEvent(this.eventEmitter, CVEvent.Delete).pipe(
      filter(({ cv }) => {
        return canTrack(user, cv);
      }),
      map(({ cv }) => {
        return new MessageEvent(Action.DELETE, { data: cv });
      }),
    );
    return merge(createEvent, updateEvent, deleteEvent);
  }

  @Get()
  async getAllCv(
    @GetUser() user: User,
    @Query() { limit, page }: PaginationCvDto,
    @Query() { age, criteria }: CvCriteriaDto,
  ): Promise<Cv[]> {
    return this.cvService.findAll(user, page, limit, age, criteria);
  }

  @Get(':cvId')
  @UseGuards(CvOwnerGuard)
  async getCvById(@Param('cvId', ParseIntPipe) id: number): Promise<Cv> {
    return this.cvService.findOne(id);
  }

  @Post()
  async createCv(
    @GetUser() user: User,
    @Body() NewCv: CreateNewCvDto,
  ): Promise<Cv> {
    return await this.cvService.createCv(NewCv, user);
  }

  @UseGuards(CvOwnerGuard)
  @Put(':cvId')
  async updateCv(
    @Body() updatecv: UpdateCvDto,
    @Param('cvId', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.cvService.update(id, updatecv, user);
  }

  @UseGuards(CvOwnerGuard)
  @Delete(':cvId')
  async deleteCv(
    @Param('cvId', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.cvService.remove(id, user);
  }

  @UseGuards(CvOwnerGuard)
  @Patch(':cvId/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
    @Param('cvId', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.cvService.uploadPhoto(id, file, user);
  }

  @UseGuards(CvOwnerGuard)
  @Put('/:cvId/:skillId')
  async addSKill(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
    @GetUser() user: User,
  ): Promise<Cv> {
    return await this.cvService.addSKill(cvId, skillId, user);
  }
}
