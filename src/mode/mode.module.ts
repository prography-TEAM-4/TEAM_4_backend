import { Module } from '@nestjs/common';
import { ModeController } from './mode.controller';
import { ModeService } from './mode.service';

@Module({
  controllers: [ModeController],
  providers: [ModeService],
})
export class ModeModule {}
