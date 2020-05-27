import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UpdateUserBalanceDto } from './dto/update-user-balance.dto';

@Controller()
export class UsersController {

    constructor(private usersService: UsersService) {}

    @MessagePattern({ role: 'user', cmd: 'create' })
    createUser(user: CreateUserDto): Promise<User> {
        console.log('createUser', user);
        return this.usersService.createUser(user);
    }
  
    @MessagePattern({ role: 'user', cmd: 'get' })
    getCurrentUser(): Promise<User> {
        return this.usersService.getUserById(1);
    }

    @MessagePattern({ role: 'user', cmd: 'list' })
    getUsers(search: string): Promise<User[]> {
        return this.usersService.getUsers(search);
    }

    @MessagePattern({ role: 'user', cmd: 'update-balance' })
    updateUserBalance(updateUserBalanceDto: UpdateUserBalanceDto): Promise<User> {
        return this.usersService.updateUserBalance(updateUserBalanceDto);
    }
}