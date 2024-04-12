import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.find(loginDto);
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (passwordMatched) {
      delete user.password;
      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Wrong Password');
    }
  }
}
