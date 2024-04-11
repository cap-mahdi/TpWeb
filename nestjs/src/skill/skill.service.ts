import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from '../entities';

@Injectable()
export class SkillService extends CrudService<Skill> {
  constructor(
    @InjectRepository(Skill)
    skillRepository: Repository<Skill>,
  ) {
    super(skillRepository);
  }
}
