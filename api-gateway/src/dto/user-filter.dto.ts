import { IsNotEmpty } from 'class-validator';

export class UsersFilterDto {
    @IsNotEmpty()
    search: string;
}