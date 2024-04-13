import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @ManyToOne(() => User, (user) => user.cv)
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.cvs)
  @JoinTable()
  skills: Skill[];
}
