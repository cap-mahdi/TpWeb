import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../entities';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/Login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  signup(
    @Body()
    createUserDto: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(
    @Body()
    loginDto: LoginDTO,
  ) {
    return this.authService.login(loginDto);
  }
}
