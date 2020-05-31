import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';

@Controller()
export class TransactionsController {

    constructor(private transactionsService: TransactionsService) {}

    @MessagePattern({ role: 'transaction', cmd: 'create' })
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        console.log('createTransaction', createTransactionDto);
        return this.transactionsService.createTransaction(createTransactionDto);
    }

    @MessagePattern({ role: 'transaction', cmd: 'list' })
    getTransactions(userId: number): Promise<Transaction[]> {
        return this.transactionsService.getTransactions(userId);
    }
}