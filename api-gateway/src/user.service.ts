import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap } from "rxjs/operators";

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_SERVICE") private userMicroService: ClientProxy
  ) {}

  
}
