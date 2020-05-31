import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap, catchError } from "rxjs/operators";
import { JwtPayload } from './dto/jwt-payload.interface';
import { throwError } from 'rxjs';
import { UserInfo } from './dto/user-info.interface';
import { UserLookup } from './dto/user-lookup.interface';
import { UserLookupRequest } from './dto/user-lookup-request.interface';
import { Transaction } from './interfaces/transaction.interface';
import { UpdateUserBalanceDto } from './dto/update-user-balance.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject("USER_SERVICE") private userMicroService: ClientProxy,
        @Inject("TRANSACTION_SERVICE") private transactionMicroService: ClientProxy
    ) {}

    async getUserInfo(jwtPayload: JwtPayload): Promise<UserInfo> {
        console.log('send getUserInfo', jwtPayload);
        const pattern = { role: 'user', cmd: 'get' };
        return this.userMicroService
            .send<UserInfo>(pattern, jwtPayload.id)
            .pipe(
                tap((message) => console.log('getUserInfo res', message)),
                catchError(err => {
                    console.log('catchError', err);
                    return throwError(err);
                })
            ).toPromise();
    }

    async getUsersList(jwtPayload: JwtPayload, search: string): Promise<UserLookup[]> {
        console.log('send getUsersList', jwtPayload);
        const pattern = { role: 'user', cmd: 'list' };
        const payload: UserLookupRequest = { currentUserId: jwtPayload.id, search }
        return this.userMicroService
            .send<UserLookup[]>(pattern, payload)
            .pipe(
                tap((message) => console.log('getUsersList res', message)),
                catchError(err => {
                    console.log('catchError', err);
                    return throwError(err);
                })
            ).toPromise();
    }
    
    async updateUserBalance(jwtPayload: JwtPayload, updateUserBalanceDto: UpdateUserBalanceDto): Promise<Transaction> {
        console.log('send updateUserBalance', jwtPayload);
        const pattern = { role: 'user', cmd: 'update-balance' };
        const payload = { fromUserId: jwtPayload.id, toUserId: updateUserBalanceDto.toUserId, amount: updateUserBalanceDto.amount };
        return this.userMicroService
            .send<Transaction>(pattern, payload)
            .pipe(
                tap((message) => console.log('updateUserBalance res', message)),
                catchError(err => {
                    console.log('catchError', err);
                    return throwError(err);
                })
            ).toPromise();
    }

    async getTransactions(jwtPayload: JwtPayload): Promise<Transaction[]> {
        console.log('send getTransactions', jwtPayload);
        const pattern = { role: 'transaction', cmd: 'list' };
        return this.transactionMicroService
            .send<Transaction[]>(pattern, jwtPayload.id)
            .pipe(
                tap((message) => console.log('getTransactions res', message)),
                catchError(err => {
                    console.log('catchError', err);
                    return throwError(err);
                })
            ).toPromise();
    }
}
