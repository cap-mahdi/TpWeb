import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cv } from './';
import { Exclude } from 'class-transformer';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  userName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @OneToMany(() => Cv, (cv) => cv.user)
  cv: Cv[];

  @Column()
  role: UserRole;
}
