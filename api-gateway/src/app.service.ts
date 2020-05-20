import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap } from "rxjs/operators";

@Injectable()
export class AppService {
  constructor(
    @Inject("USER_SERVICE") private readonly clientServiceA: ClientProxy
  ) {}

  pingServiceA() {
    const startTs = Date.now();
    const pattern = { cmd: "ping" };
    const payload = {};
    return this.clientServiceA
      .send<string>(pattern, payload)
      .pipe(
        tap((message: string) => console.log(message)),
        map((message: string) => ({ message, duration: Date.now() - startTs }))
      );
  }
}
