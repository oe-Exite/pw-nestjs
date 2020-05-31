export interface Transaction {
    id: number;
    amount: number;
    createdAt: Date;
    senderId: number;
    senderName: string;
    senderBalance: number;
    recipientId: number;
    recipientName: string;
    recipientBalance: number;
}