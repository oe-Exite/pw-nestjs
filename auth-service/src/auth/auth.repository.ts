import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { JwtPayload } from './dto/jwt-payload.dto';

@EntityRepository(AuthUser)
export class AuthRepository extends Repository<AuthUser> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<AuthUser> {
        const { name, email, password } = authCredentialsDto;

        let existedUser = await this.findOne({ name });
        if (existedUser) {
            throw new ConflictException(`User with name "${name}" already exists`);
        }

        existedUser = await this.findOne({ email });
        if (existedUser) {
            throw new ConflictException(`User with email "${email}" already exists`);
        }

        const user = new AuthUser();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            console.log('signUp catch', error.message);
            throw new InternalServerErrorException();
        }
        return user;
    }

    async validateUserPassword(authSigninDto: AuthSigninDto): Promise<JwtPayload> {
        const { email, password } = authSigninDto;
        const user = await this.findOne({ email });

        if (user && await user.validatePassword(password)) {
            return { id: user.id, name: user.name };
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}