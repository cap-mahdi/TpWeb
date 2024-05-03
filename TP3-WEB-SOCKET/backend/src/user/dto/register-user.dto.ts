import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO {
    @IsString()
    @IsNotEmpty()
    username: string;
}
