import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly config:ConfigService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('working')
  getWORKING(): string {
    return this.appService.getWORKING();
  }
  @Get('env')
  env():string{
    return this.config.get<string>('test');
  }
}
