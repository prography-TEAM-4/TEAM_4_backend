import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'working test';
  }
  getWORKING(): string {
    return 'work...?';
  }
}
