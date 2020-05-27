import { CanActivate, Inject, ExecutionContext } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { timeout } from "rxjs/operators";

export class AuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE')
        private authMicroService: ClientProxy
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const res = await this.authMicroService.send(
                { role: 'auth', cmd: 'check' },
                { jwt: req.headers['authorization']?.split(' ')[1]})
                .pipe(timeout(5000))
                .toPromise<boolean>();

            return res;
        } catch(err) {
            // Logger.error(err);
            return false;
        }
    }
  }