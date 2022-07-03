import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  getHello(): string {
    return 'working test';
  }

  secretTest(): string {
    return this.config.get('SECRET') || 'there is no secret';
  }
}
