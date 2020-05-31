import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3001
        }
      },
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3002
        }
      },
      {
        name: "TRANSACTION_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3003
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [UserService, AuthService],
})
export class AppModule {}
