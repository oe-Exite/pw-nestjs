import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { tap, map, catchError } from 'rxjs/operators';
import { ResultMessage } from './dto/result-message.dto';
import { AuthResult } from './dto/auth-result.dto';
import { throwError } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        @Inject("AUTH_SERVICE") 
        private authMicroService: ClientProxy
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const pattern = { role: 'auth', cmd: 'signup' };
        console.log('send signUp', authCredentialsDto);
        return this.authMicroService
            .send(pattern, authCredentialsDto)
            .pipe(
                tap((e) => console.log('signUp res', e)),
                catchError(err => {
                    console.log('catchError', err);
                    return throwError(err);
                })
            ).toPromise();
    }

    async signIn(authSigninDto: AuthSigninDto): Promise<AuthResult> {
        const pattern = { role: 'auth', cmd: 'signin' };
        console.log('send signIn', authSigninDto);
        return this.authMicroService
            .send<AuthResult>(pattern, authSigninDto)
            .pipe(
                tap((message) => console.log('signIn res', message)),
                catchError(err => {
                    console.log('catchError', err);
                    return throwError(err);
                })
                //map((message: string) => ({ message }))
            ).toPromise();
    }
}
