import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from '../entities';

@Injectable()
export class CvService extends CrudService<Cv> {
  constructor(
    @InjectRepository(Cv)
    cvRepository: Repository<Cv>,
  ) {
    super(cvRepository);
  }


}
