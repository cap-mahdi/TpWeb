import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CrudService } from '../common/services/crud.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRole } from './dto/userRole.dto';
@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const userWithSameEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } })
    if (userWithSameEmail)
      throw new BadRequestException("there is a user with the same email")
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.userRepository.save({
      ...createUserDto,
      role: UserRole.User,
    });

    delete user.password;
    return user;
  }
  async find(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }
}
