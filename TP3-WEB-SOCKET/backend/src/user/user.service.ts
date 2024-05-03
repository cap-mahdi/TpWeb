import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto';
import { IUser } from './interface';

@Injectable()
export class UserService {
    private users: IUser[] = [];

    register(registerUserDto: RegisterUserDTO) {
        const newUser: IUser = {
            id: Date.now().toString(),
            username: registerUserDto.username
        }
        this.users.push(newUser);
        return newUser;
    }
}
