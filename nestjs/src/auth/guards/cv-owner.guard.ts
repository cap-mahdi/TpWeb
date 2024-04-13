import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from 'src/entities';
@Injectable()
export class CvOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cvId = request.params.id;
    const { user } = request;
    const cv = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ['user'],
    });
    if (!cv) throw new NotFoundException();
    const isOwner = cv.user.id == user.id;

    return isOwner;
  }
}
