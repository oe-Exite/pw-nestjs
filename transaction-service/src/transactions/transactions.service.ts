import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionRepository } from "./transaction.repository";
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionRepository)
        private transactionRepository: TransactionRepository,
    ) {}

    async getTransactions(userId: number): Promise<Transaction[]> {
        return this.transactionRepository.getTransactions(userId);
    }

    async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionRepository.createTransaction(createTransactionDto);
    }
}