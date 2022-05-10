import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomController } from './random.controller';

@Module({
  providers: [RandomService],
  controllers: [RandomController]
})
export class RandomModule {}
