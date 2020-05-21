import { IsNotEmpty } from 'class-validator';

export class UpdateUserBalanceDto {
    @IsNotEmpty()
    fromUserId: number;

    @IsNotEmpty()
    toUserId: number;

    @IsNotEmpty()
    balance: number;
}