import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Cv } from './cv.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @ManyToMany(() => Cv, (cv) => cv.skills)
  cvs: Cv[];
}
