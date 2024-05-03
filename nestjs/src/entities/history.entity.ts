import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User, Cv } from './';

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class History<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: Action,
  })
  action: Action;

  entity: T;

  originalEntity: T;
}

@Entity()
export class OldValueCv extends Cv {}

@Entity()
export class CvHistory extends History<Cv> {
  @OneToOne(() => OldValueCv, { nullable: false })
  @JoinColumn()
  entity: Cv;

  @ManyToOne(() => Cv, { nullable: false, cascade: true })
  originalEntity: Cv;
}
