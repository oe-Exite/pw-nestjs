import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSigninDto } from './dto/auth-signin.dto';

@EntityRepository(AuthUser)
export class AuthRepository extends Repository<AuthUser> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<AuthUser> {
        const { name, email, password } = authCredentialsDto;

        const user = new AuthUser();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            console.log('signUp catch', error.message);
            if (error.message.includes('Violation of UNIQUE KEY')) {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
        return user;
    }

    async validateUserPassword(authSigninDto: AuthSigninDto): Promise<string> {
        const { email, password } = authSigninDto;
        const user = await this.findOne({ email });

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