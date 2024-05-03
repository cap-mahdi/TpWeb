import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { User, Skill } from './';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstName: string;

  @Column()
  age: number;

  @Column()
  cin: number;

  @Column()
  job: string;

  @Column({ nullable: true })
  path: string;

  @ManyToOne(() => User, (user) => user.cv, { eager: true })
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.cvs, { eager: true })
  @JoinTable()
  skills: Skill[];

  @Column({ default: false })
  isDeleted: boolean;
}
