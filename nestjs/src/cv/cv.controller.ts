import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { User } from 'src/entities';

@Controller('cv')
export class CvController {
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  hello(@GetUser() user: User): string {
    console.log('from controller : ', user);
    return 'hello';
  }
}
