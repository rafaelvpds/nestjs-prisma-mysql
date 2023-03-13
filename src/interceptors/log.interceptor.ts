import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
} from '@nestjs/common/interfaces';
import { Observable, tap } from 'rxjs';

export class LogInterceprtor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const dt = Date.now();
        return next.handle().pipe(
            tap(() => {
                const request = context.switchToHttp().getRequest();
                console.log(`A URL:${request.url} `);
                console.log(`A Method:${request.method} `);
                console.log(`A execução levou:  ${Date.now() - dt}`);
            }),
        );
    }
}
