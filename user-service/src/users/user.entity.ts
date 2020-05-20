import { BaseEntity, Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    balance: number;
}