import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto';
import { IUser } from './interface';

@Injectable()
export class UserService {
  private users: IUser[] = [
    {
      id: '1',
      username: 'Mehdi Fkih',
    },
    {
      id: '2',
      username: 'Houssem sahnoun',
    },
  ];

  login(registerUserDto: RegisterUserDTO) {
    for (const user of this.users) {
      if (user.username === registerUserDto.username) {
        return user;
      }
    }
    return null;
  }

  findAll() {
    return this.users;
  }
}
