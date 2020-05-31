import { Injectable, UnauthorizedException, Inject, RequestTimeoutException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap, catchError } from "rxjs/operators";
import { AuthUser } from './auth.entity';
import { throwError, TimeoutError } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
        @Inject("USER_SERVICE") 
        private userMicroService: ClientProxy
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        try {
            const user = await this.authRepository.signUp(authCredentialsDto);
            console.log('signUp user', user);
            await this.sendCreatedUser(user);
        } catch(e) {
            console.log('signUp catch', e);
            return e;
        }
    }

    async signIn(authSigninDto: AuthSigninDto): Promise<{ accessToken: string }> {
        try {
            const payload = await this.authRepository.validateUserPassword(authSigninDto);
            if (!payload) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        } catch(e) {
            console.log('signIn catch', e);
            return e;
        }
    }

    validateToken(jwt: string) {
        try {
            return this.jwtService.verify(jwt);
        } catch(e) {
            console.log('validateToken catch', e);
            return false;
        }
    }

    private async sendCreatedUser(user: AuthUser) {
        const pattern = { role: 'user', cmd: 'create' };
        const { id, name, email, ...partialObject} = user;
        const payload = { id, name, email };
        console.log('sendCreatedUser', payload);
        return this.userMicroService
            .send<string>(pattern, payload)
            .pipe(
                tap((message: string) => console.log('sendCreatedUser response', message)),
                catchError(err => {
                    console.log('catchError', err);
                    if (err instanceof TimeoutError) {
                        return throwError(new RequestTimeoutException());
                    }
                    return throwError(err);
                })
                //map((message: string) => ({ message }))
            ).toPromise()
            .catch((e) => {
                console.log('catch promise', e);
                throw new InternalServerErrorException();
            });
    }
}