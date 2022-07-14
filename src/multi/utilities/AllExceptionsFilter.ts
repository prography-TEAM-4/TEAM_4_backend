import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('exception');
    console.log(exception);
    console.log('host');
    console.log(host);
    super.catch(exception, host);
  }
}
