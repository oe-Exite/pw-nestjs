import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserBalanceDto {
    @IsNotEmpty()
    // @Transform(toUserId => {
    //     const parsed = parseInt(toUserId);
    //     return toUserId === parsed ? parsed : false
    // }, {toClassOnly: true})
    @IsNumber()
    toUserId: number;

    @IsNotEmpty()
    // @Transform(amount => {
    //     const parsed = parseInt(amount);
    //     return amount === parsed ? parsed : false
    // }, {toClassOnly: true})
    @IsNumber()
    amount: number;
}