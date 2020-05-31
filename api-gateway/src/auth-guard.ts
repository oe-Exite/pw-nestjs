import { CanActivate, Inject, ExecutionContext } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { timeout, catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";

export class AuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE')
        private authMicroService: ClientProxy
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('canActivate');
        const req = context.switchToHttp().getRequest();

        try {
            const res = await this.authMicroService.send(
                { role: 'auth', cmd: 'check' },
                { jwt: req.headers['authorization']?.split(' ')[1]})
                .pipe(
                    timeout(5000),
                    tap((user) => { 
                        console.log('auth check res', user);
                        context.getArgs()[0].user = user;
                    }),
                    catchError(err => {
                        console.log('catchError', err);
                        return throwError(err);
                    })
                )
                .toPromise<boolean>();

            return res;
        } catch(err) {
            // Logger.error(err);
            return false;
        }
    }
  }