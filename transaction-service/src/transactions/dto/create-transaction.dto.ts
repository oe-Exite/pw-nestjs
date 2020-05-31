import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    senderId: number;

    @IsNotEmpty()
    senderName: string;

    @IsNotEmpty()
    senderBalance: number;

    @IsNotEmpty()
    recipientId: number;

    @IsNotEmpty()
    recipientName: string;

    @IsNotEmpty()
    recipientBalance: number;
}