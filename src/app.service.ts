import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  getHello(): string {
    return 'working test';
  }

  secretTest(): string {
    return this.config.get('test') || 'there is no secret';
  }
}
