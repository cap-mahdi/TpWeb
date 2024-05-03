import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv, Skill, User, UserRole } from '../entities';
import * as fs from 'fs-extra';
import { join } from 'path';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CVEvent } from '../common/events';

@Injectable()
export class CvService extends CrudService<Cv> {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    private eventEmitter: EventEmitter2,
  ) {
    super(cvRepository);
  }

  findAll(
    user: User = null,
    page: number = 1,
    limit: number = 10,
    age?: number,
    criteria?: string,
  ): Promise<Cv[]> {
    const filter = [
      { job: ILike(`%${criteria}%`) },
      { firstName: ILike(`%${criteria}%`) },
      { name: ILike(`%${criteria}%`) },
      { age },
    ];
    if (user && user.role === UserRole.Admin) {
      return this.cvRepository.find({
        where: { ...filter, isDeleted: false },
        take: limit,
        skip: (page - 1) * limit,
      });
    } else {
      return this.cvRepository.find({
        where: { user, ...filter },
        take: limit,
        skip: (page - 1) * limit,
      });
    }
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user', 'skills'],
    });
    if (!cv) throw new NotFoundException('cv not found');
    return cv;
  }

  async createCv(createNewCvDto: CreateNewCvDto, user: User) {
    const newCv = await this.cvRepository.create({
      ...createNewCvDto,
      user,
    });
    const savedCv = await this.cvRepository.save(newCv);

    this.eventEmitter.emit(CVEvent.Add, { cv: savedCv, user });
    return savedCv;
  }

  async addSKill(cvId: number, skillId: number, user: User): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id: cvId, isDeleted: false },
    });
    if (!cv) {
      throw new NotFoundException('cv not found');
    }
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });
    if (!skill) {
      throw new NotFoundException('skill not found');
    }

    const cvUpdated = await this.cvRepository
      .createQueryBuilder()
      .relation(Cv, 'skills')
      .of(cvId)
      .add(skillId)
      .then(() => this.findOne(cvId));
    this.eventEmitter.emit(CVEvent.Update, { cv: cvUpdated, user: user });
    return cvUpdated;
  }

  async update(id: number, updateDto: Partial<Cv>, user: User = null) {
    const cv = await this.cvRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!cv) throw new NotFoundException();
    const updatedCv = await this.cvRepository.save({ ...cv, ...updateDto });
    this.eventEmitter.emit(CVEvent.Update, { cv: updatedCv, user });
    return updatedCv;
  }

  async uploadPhoto(id: number, file: Express.Multer.File, user: User) {
    const foundCv = await this.cvRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!foundCv) throw new NotFoundException();

    const fileName = Date.now() + file.originalname;
    const filePath = join(process.cwd(), 'public/uploads', fileName);

    try {
      await fs.writeFile(filePath, file.buffer);
      foundCv.path = `/public/uploads/${fileName}`;
      // foundCv.path = foundCv.path.replace(/\s/g, '_');

      const newCv = await this.cvRepository.save(foundCv);
      this.eventEmitter.emit(CVEvent.Update, {
        cv: newCv,
        user,
      });
      return foundCv;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, user: User = null) {
    const cv = await this.cvRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!cv) throw new NotFoundException('cv not found');
    const cvDeleted = await this.cvRepository.save({ ...cv, isDeleted: true });
    this.eventEmitter.emit(CVEvent.Delete, { cv: cvDeleted, user });
    return cvDeleted;
  }
}
