import { BaseEntity, Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn } from "typeorm";

@Entity()
export class Transaction extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    senderId: number;

    @Column()
    senderName: string;

    @Column()
    senderBalance: number;

    @Column()
    recipientId: number;

    @Column()
    recipientName: string;

    @Column()
    recipientBalance: number;
}