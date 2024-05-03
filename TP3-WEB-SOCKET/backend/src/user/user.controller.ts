import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() registerUserDto: RegisterUserDTO) {
        return this.userService.register(registerUserDto);
    }

}
