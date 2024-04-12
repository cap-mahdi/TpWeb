import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv, Skill } from '../entities';

@Injectable()
export class CvService extends CrudService<Cv> {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {
    super(cvRepository);
  }

  async addSKill(cvId: number, skillId: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ where: { id: cvId } });
    if (!cv) {
      throw new NotFoundException('cv not found');
    }
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });
    if (!skill) {
      throw new NotFoundException('skill not found');
    }
    return this.cvRepository
      .createQueryBuilder()
      .relation(Cv, 'skills')
      .of(cvId)
      .add(skillId)
      .then(() => this.findOne(cvId));
  }
}
