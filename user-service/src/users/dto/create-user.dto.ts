import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}