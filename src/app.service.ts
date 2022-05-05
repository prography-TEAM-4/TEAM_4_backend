import { Injectable } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class AppService {
  getHello(): string {
    return 'working test';
  }

  asdf(): string {
    return 'test';
  }
}
