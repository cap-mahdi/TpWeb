import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Cv, Skill } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, Skill])],

  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
