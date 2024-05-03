import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv, CvHistory, OldValueCv } from '../entities';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { CvModule } from 'src/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([OldValueCv, CvHistory, Cv])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
