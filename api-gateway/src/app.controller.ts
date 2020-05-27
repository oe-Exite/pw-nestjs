import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ResultMessage } from './dto/result-message.dto';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthResult } from './dto/auth-result.dto';

@Controller()
export class AppController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authSigninDto: AuthSigninDto): Promise<AuthResult> {
        return this.authService.signIn(authSigninDto);
    }
}
