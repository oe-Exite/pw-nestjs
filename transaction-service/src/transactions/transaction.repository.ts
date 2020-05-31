import { EntityRepository, Repository } from "typeorm";
import { Transaction } from "./transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {

    async getTransactions(userId: number): Promise<Transaction[]> {
        const query = this.createQueryBuilder('transaction');
        query.where('transaction.senderId = :userId', { userId });
        query.orWhere('transaction.recipientId = :userId', { userId });
        query.orderBy('createdAt', 'DESC');
    
        const transactions = await query.getMany();
        return transactions;
    }

    async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const { amount, senderId, senderName, senderBalance,
            recipientId, recipientName, recipientBalance } = createTransactionDto;
    
        const transaction = new Transaction();
        transaction.amount = amount;
        transaction.senderId = senderId;
        transaction.senderName = senderName;
        transaction.senderBalance = senderBalance;
        transaction.recipientId = recipientId;
        transaction.recipientName = recipientName;
        transaction.recipientBalance = recipientBalance;
        await transaction.save();
    
        return transaction;
    }
}