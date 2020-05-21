import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserBalanceDto } from "./dto/update-user-balance.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async getUsers(search: string): Promise<User[]> {
        return this.userRepository.getUsers(search);
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

    async updateUserBalance(updateUserBalanceDto: UpdateUserBalanceDto): Promise<User> {
        const fromUser = await this.getUserById(updateUserBalanceDto.fromUserId);
        const toUser = await this.getUserById(updateUserBalanceDto.toUserId);
        fromUser.balance -= updateUserBalanceDto.balance;
        toUser.balance += updateUserBalanceDto.balance;
        await this.userRepository.updateUserBalance(fromUser, toUser);
        return fromUser;
    }
}