import { EntityRepository, Repository } from "typeorm";
import { Transaction } from "./transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {

    async getTransactions(userId: number): Promise<Transaction[]> {
        const queryForSender = this.createQueryBuilder('transaction');
        queryForSender.where('transaction.senderId = :userId', { userId });
        queryForSender.select(['transaction.id', 'transaction.amount', 'transaction.createdAt', 'transaction.senderId',
            'transaction.senderName', 'transaction.senderBalance', 'transaction.recipientId', 'transaction.recipientName']);
        const transactionsForSender = await queryForSender.getMany();

        const queryForRecipient = this.createQueryBuilder('transaction');
        queryForRecipient.where('transaction.recipientId = :userId', { userId });
        queryForRecipient.select(['transaction.id', 'transaction.amount', 'transaction.createdAt', 'transaction.senderId',
            'transaction.senderName', 'transaction.recipientId', 'transaction.recipientName', 'transaction.recipientBalance']);
        const transactionsForRecipient = await queryForRecipient.getMany();

        const transactions = [...transactionsForSender, ...transactionsForRecipient]
            .sort((a, b) => {
                return b.createdAt.getTime() - a.createdAt.getTime();
            });
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