import { Injectable, NotFoundException, Inject, RequestTimeoutException, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserBalanceDto } from "./dto/update-user-balance.dto";
import { ClientProxy } from "@nestjs/microservices";
import { map, tap, catchError } from "rxjs/operators";
import { TimeoutError, throwError } from "rxjs";
import { CreateTransaction } from './interfaces/create-transaction.interface';
import { Transaction } from "./interfaces/transaction.interface";
import { UsersListDto } from "./dto/users-list.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @Inject("TRANSACTION_SERVICE") 
        private transactionMicroService: ClientProxy
    ) {}

    async getUsers(usersListDto: UsersListDto): Promise<User[]> {
        return this.userRepository.getUsers(usersListDto);
    }

    async getUserById(id: number): Promise<User> {
        const found = await this.userRepository.findOne(id);
    
        if (!found) {
          throw new NotFoundException(`User with ID "${id}" not found`);
        }
    
        return found;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.userRepository.createUser(createUserDto);
    }

    async updateUserBalance(updateUserBalanceDto: UpdateUserBalanceDto): Promise<Transaction> {
        try {
            if (updateUserBalanceDto.fromUserId === updateUserBalanceDto.toUserId) {
                throw new BadRequestException('fromUserId must differ from toUserId');
            }
            if (updateUserBalanceDto.amount < 1) {
                throw new BadRequestException('amount must be > 0');
            }
            const fromUser = await this.getUserById(updateUserBalanceDto.fromUserId);
            if (fromUser && fromUser.balance < updateUserBalanceDto.amount) {
                throw new BadRequestException('balance exceeded');
            }
            const toUser = await this.getUserById(updateUserBalanceDto.toUserId);
            fromUser.balance -= updateUserBalanceDto.amount;
            toUser.balance += updateUserBalanceDto.amount;
            await this.userRepository.updateUserBalance(fromUser, toUser);
            return this.sendNewTransaction(fromUser, toUser, updateUserBalanceDto.amount);
        } catch(e) {
            console.log('updateUserBalance catch', e);
            return e;
        }
    }

    private async sendNewTransaction(fromUser: User, toUser: User, amount: number): Promise<Transaction> {
        const pattern = { role: 'transaction', cmd: 'create' };
        const payload: CreateTransaction = {
            amount,
            senderId: fromUser.id,
            senderName: fromUser.name,
            senderBalance: fromUser.balance,
            recipientId: toUser.id,
            recipientName: toUser.name,
            recipientBalance: toUser.balance
        };
        console.log('sendNewTransaction', payload);
        return this.transactionMicroService
            .send<Transaction>(pattern, payload)
            .pipe(
                tap((message: Transaction) => console.log('sendNewTransaction response', message)),
                catchError(err => {
                    console.log('catchError', err);
                    if (err instanceof TimeoutError) {
                        return throwError(new RequestTimeoutException());
                    }
                    return throwError(err);
                })
            ).toPromise()
            .catch((e) => {
                console.log('catch promise', e);
                throw new InternalServerErrorException();
            });
    }
}