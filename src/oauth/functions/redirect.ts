import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // console.log('context');
    // console.log(context.switchToHttp().getResponse());
    // console.log('next');
    // console.log(next);
    const res = context.switchToHttp().getResponse();
    // console.log(res);

    next.handle().pipe(
      map((value) => {
        console.log(value);
        return value === null ? '' : value;
      }),
    );

    return of('testing');
    // return res.redirect('http://google.com');
  }
  //   intercept(
  //     context: ExecutionContext,
  //     stream$: Observable<any>,
  //   ): Observable<any> {
  //     const response = context.switchToHttp().getResponse();
  //     response.redirect('redirect-target');
  //     return stream$;
  //   }
}
