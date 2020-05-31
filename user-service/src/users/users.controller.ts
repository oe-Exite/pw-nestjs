import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UpdateUserBalanceDto } from './dto/update-user-balance.dto';
import { Transaction } from './dto/transaction.interface';
import { UsersListDto } from './dto/users-list.dto';

@Controller()
export class UsersController {

    constructor(private usersService: UsersService) {}

    @MessagePattern({ role: 'user', cmd: 'create' })
    createUser(user: CreateUserDto): Promise<User> {
        console.log('createUser', user);
        return this.usersService.createUser(user);
    }
  
    @MessagePattern({ role: 'user', cmd: 'get' })
    getUserById(id: number): Promise<User> {
        console.log('getUserById', id);
        return this.usersService.getUserById(id);
    }

    @MessagePattern({ role: 'user', cmd: 'list' })
    getUsers(usersListDto: UsersListDto): Promise<User[]> {
        return this.usersService.getUsers(usersListDto);
    }

    @MessagePattern({ role: 'user', cmd: 'update-balance' })
    updateUserBalance(updateUserBalanceDto: UpdateUserBalanceDto): Promise<Transaction> {
        return this.usersService.updateUserBalance(updateUserBalanceDto);
    }
}