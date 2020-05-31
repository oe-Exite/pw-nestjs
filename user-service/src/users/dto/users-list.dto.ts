import { IsNotEmpty } from 'class-validator';

export class UsersListDto {
    @IsNotEmpty()
    currentUserId: number;

    @IsNotEmpty()
    search: string;
}