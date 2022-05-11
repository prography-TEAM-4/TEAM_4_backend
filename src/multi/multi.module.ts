import { Module } from '@nestjs/common';
import { MultiGateway } from './multi.gateway';

@Module({
    providers: [MultiGateway],
    exports: [MultiGateway],
})
export class MultiModule {}
