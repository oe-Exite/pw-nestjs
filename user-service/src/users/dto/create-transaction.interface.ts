export interface CreateTransaction {
    amount: number;
    senderId: number;
    senderName: string;
    senderBalance: number;
    recipientId: number;
    recipientName: string;
    recipientBalance: number;
}