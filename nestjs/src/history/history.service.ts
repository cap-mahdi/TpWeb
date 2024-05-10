import { Delete, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, Cv, CvHistory, OldValueCv, User } from '../entities';
import { Repository } from 'typeorm';
import { CVEvent } from 'src/common/events';
import { GetUser } from 'src/auth/decorators/user.decorator';
@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(CvHistory)
    private cvHistoryRepository: Repository<CvHistory>,
    @InjectRepository(OldValueCv)
    private cvOldValueRepository: Repository<OldValueCv>,
  ) {}

  getAll(): Promise<CvHistory[]> {
    return this.cvHistoryRepository.find({
      relations: ['user', 'entity', 'originalEntity'],
    });
  }

  getCvHistory(id: number): Promise<CvHistory[]> {
    return this.cvHistoryRepository.find({
      where: { originalEntity: { id } },
      relations: ['user', 'entity', 'entity.skills'],
    });
  }

  async saveCvHistory(cv: Cv, user: User, action: Action) {
    const { id, ...cvData } = cv;
    const OldValueCv = await this.cvOldValueRepository.save(cvData);
    const cvHistory = new CvHistory();
    cvHistory.originalEntity = cv;
    cvHistory.entity = OldValueCv;
    cvHistory.user = user;
    cvHistory.action = action;
    return this.cvHistoryRepository.save(cvHistory);
  }
  @OnEvent(CVEvent.Add)
  async cvAddListener({ cv, user }) {
    return this.saveCvHistory(cv, user, Action.CREATE);
  }
  @OnEvent(CVEvent.Update)
  async cvUpdateListener({ cv, user }) {
    return this.saveCvHistory(cv, user, Action.UPDATE);
  }
  @OnEvent(CVEvent.Delete)
  async cvDeleteListener({ cv, user }) {
    return this.saveCvHistory(cv, user, Action.DELETE);
  }
}
