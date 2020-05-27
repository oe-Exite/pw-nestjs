import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtRequest } from './dto/jwt-request.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSigninDto } from './dto/auth-signin.dto';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @MessagePattern({ role: 'auth', cmd: 'signin'})
    async signIn(authSigninDto: AuthSigninDto): Promise<{ accessToken: string }> {
        console.log('signIn', authSigninDto);
        return this.authService.signIn(authSigninDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'signup'})
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        console.log('signUp', authCredentialsDto);
        return this.authService.signUp(authCredentialsDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'check'})
    async checkToken(request: JwtRequest) {
        console.log('checkToken', request);
        return this.authService.validateToken(request.jwt);
    }
}
