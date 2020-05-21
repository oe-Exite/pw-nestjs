import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from "rxjs/operators";
import { UsersService } from './users.service';

@Controller()
export class UsersController {

  constructor(private usersService: UsersService) {}

  @MessagePattern({ cmd: "ping" })
  ping(_: any) {
    return of("pong").pipe(delay(1000));
  }

  
}