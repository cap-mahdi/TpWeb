import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() registerUserDto: RegisterUserDTO) {
    return this.userService.login(registerUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
