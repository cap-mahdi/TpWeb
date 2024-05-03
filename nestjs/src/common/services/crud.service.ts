import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { HasId } from '../interfaces/hasId.interface';

@Injectable()
export class CrudService<Entity extends HasId> {
  constructor(private repository: Repository<Entity>) {}

  async create(entity: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(entity);
  }

  async update(id: number, updateDto: DeepPartial<Entity>): Promise<Entity> {
    const entity = await this.repository.preload({
      id,
      ...updateDto,
    });
    if (!entity) {
      throw new NotFoundException('entity Not Found');
    }

    return this.repository.save(entity);
  }

  async remove(id: any): Promise<Entity> {
    const entityToRemove = await this.findOne(id);
    if (!entityToRemove) {
      throw new NotFoundException('entity Not Found');
    }
    return this.repository.remove(entityToRemove);
  }

  findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  async findOne(id: any): Promise<Entity | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('entity Not Found');
    }
    return entity;
  }
}
