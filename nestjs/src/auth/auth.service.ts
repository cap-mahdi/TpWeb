import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        const foundUser = await this.userRepository.findOne({
            where: { email: loginDto.email },
            select: { email: true, password: true, id: true }
        })
        if (!foundUser)
            throw new BadRequestException("wrong credentials")
        const isMatch = await bcrypt.compare(
            loginDto.password,
            foundUser.password,
        );
        if (!isMatch)
            throw new BadRequestException("wrong credentials")
        const payload = { sub: foundUser.id, username: loginDto.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
