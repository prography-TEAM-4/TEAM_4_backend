import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Mode')
@Controller('mode')
export class ModeController {
  @ApiOperation({ summary: '싱글모드' })
  @Get('single')
  getHome() {
    return 'single mode';
  }
}
