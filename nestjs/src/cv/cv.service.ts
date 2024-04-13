import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv, Skill, User } from '../entities';
import * as fs from 'fs-extra';
import { join } from 'path';
import { CreateNewCvDto } from './dto/create-new-cv.dto';
import { UserRole } from '../user/dto/userRole.dto';

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

  findAll(
    page: number = 1,
    limit: number = 10,
    user: User = null,
  ): Promise<Cv[]> {
    if (user && user.role === UserRole.Admin) {
      return this.cvRepository.find({
        take: limit,
        skip: (page - 1) * limit,
      });
    } else {
      return this.cvRepository.find({
        where: { user },
        take: limit,
        skip: (page - 1) * limit,
      });
    }
  }

  async createCv(createNewCvDto: CreateNewCvDto, user: User) {
    const newCv = await this.cvRepository.create({
      ...createNewCvDto,
      user,
    });
    const savedCv = await this.cvRepository.save(newCv);
    return savedCv;
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

  async uploadPhoto(id: number, file) {
    const foundCv = await this.cvRepository.findOne({ where: { id } });
    if (!foundCv) throw new NotFoundException();

    console.log(file);

    const fileName = Date.now() + file.originalname;
    const filePath = join(process.cwd(), 'public/uploads', fileName);

    try {
      await fs.writeFile(filePath, file.buffer);
      foundCv.path = fileName;
      await this.cvRepository.save(foundCv);
      return {
        success: true,
        message: 'File uploaded successfully.',
        cv: foundCv,
      };
    } catch (error) {
      console.error(error);

      return { success: false, message: 'Failed to upload file.' };
    }
  }
}
