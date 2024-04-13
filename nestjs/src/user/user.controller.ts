import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(id: number) {
    return this.userService.findOne(id);
  }
}
