import { IsString, IsEmail } from 'class-validator';

export class AuthSigninDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}