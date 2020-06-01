import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ResultMessage } from './interfaces/result-message.interface';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthResult } from './interfaces/auth-result.interface';
import { AuthGuard } from './auth-guard';
import { GetUser } from './get-user.decorator';
import { UserInfo } from './interfaces/user-info.interface';
import { UserLookup } from './interfaces/user-lookup.interface';
import { UsersFilterDto } from './dto/user-filter.dto';
import { Transaction } from './interfaces/transaction.interface';
import { UpdateUserBalanceDto } from './dto/update-user-balance.dto';

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

    @Get('/user-info')
    @UseGuards(AuthGuard)
    getUserInfo(@Req() req): Promise<UserInfo> {
        console.log('getUserInfo');
        return this.userService.getUserInfo(req.user);
    }

    @Get('/user-transactions')
    @UseGuards(AuthGuard)
    getUserTransactions(@Req() req): Promise<Transaction[]> {
        console.log('getUserTransactions');
        return this.userService.getTransactions(req.user);
    }

    @Post('/users-list')
    @UseGuards(AuthGuard)
    getUsersList(@Req() req, @Body(ValidationPipe) usersFilterDto: UsersFilterDto): Promise<UserLookup[]> {
        console.log('getUsersList', usersFilterDto);
        return this.userService.getUsersList(req.user, usersFilterDto.search);
    }

    @Post('/update-balance')
    @UseGuards(AuthGuard)
    updateUserBalance(@Req() req, @Body(new ValidationPipe({ transform: true })) updateUserBalanceDto: UpdateUserBalanceDto): Promise<Transaction> {
        console.log('updateUserBalance', updateUserBalanceDto);
        return this.userService.updateUserBalance(req.user, updateUserBalanceDto);
    }
}
