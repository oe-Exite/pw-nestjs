import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "USER_SERVICE",
                transport: Transport.TCP,
                options: {
                    port: 3001
                }
            }]
        ),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'pwSecret51',
            signOptions: {
                expiresIn: 3600,
            },
        }),
        TypeOrmModule.forFeature([AuthRepository]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    exports: [
        JwtStrategy,
        PassportModule,
    ],
})
export class AuthModule {}