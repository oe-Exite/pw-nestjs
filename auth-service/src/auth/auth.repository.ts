import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './auth.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';

@EntityRepository(AuthUser)
export class AuthRepository extends Repository<AuthUser> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { name, email, password } = authCredentialsDto;

        const user = new AuthUser();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') { // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { name, password } = authCredentialsDto;
        const user = await this.findOne({ name });

        if (user && await user.validatePassword(password)) {
            return user.name;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}