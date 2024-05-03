import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from '../../entities';
import { AdminGuard } from './admin.guard';
@Injectable()
export class CvOwnerGuard extends AdminGuard {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cvId = request.params.cvId;
    if (!cvId) return super.canActivate(context) as boolean;
    const { user } = request;
    const cv = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ['user'],
    });
    if (!cv) throw new NotFoundException();
    const isOwner = cv.user.id == user.id;
    if (isOwner) return true;
    return super.canActivate(context) as boolean;
  }
}
