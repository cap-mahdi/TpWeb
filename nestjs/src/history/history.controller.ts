import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CvHistory } from 'src/entities';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CvOwnerGuard } from 'src/auth/guards/cv-owner.guard';

@Controller('history')
@UseGuards(AuthGuard('jwt'))
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @UseGuards(AdminGuard)
  @Get('cv')
  async getAllCvHistory(): Promise<CvHistory[]> {
    return this.historyService.getAll();
  }

  @UseGuards(CvOwnerGuard)
  @Get('cv/:cvId')
  async getCvHistory(@Param('cvId') id: number): Promise<CvHistory[]> {
    return this.historyService.getCvHistory(id);
  }
}
