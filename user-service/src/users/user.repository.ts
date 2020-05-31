import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersListDto } from "./dto/users-list.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async getUsers(usersListDto: UsersListDto): Promise<User[]> {
        const query = this.createQueryBuilder('user');
    
        if (usersListDto.search) {
            query.andWhere('(user.name LIKE :search)', { search: `%${usersListDto.search}%` });
            query.andWhere('(user.id != :userId)', { userId: `%${usersListDto.currentUserId}%` });
        }
    
        const users = await query.getMany();
        return users;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { id, name, email } = createUserDto;
    
        const user = new User();
        user.id = id;
        user.name = name;
        user.email = email;
        user.balance = 500;
        await user.save();
    
        return user;
    }

    async updateUserBalance(fromUser: User, toUser: User): Promise<void> {
        return this.manager.transaction(async transactionalManager => {
            await transactionalManager.save(fromUser);
            await transactionalManager.save(toUser);
        });
    }
}