import { BaseEntity, Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['name', 'email'])
export class AuthUser extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    password: string;

    @Column()
    salt: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}