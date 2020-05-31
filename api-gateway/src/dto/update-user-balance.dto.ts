import { IsNotEmpty } from 'class-validator';

export class UpdateUserBalanceDto {
    @IsNotEmpty()
    toUserId: number;

    @IsNotEmpty()
    amount: number;
}