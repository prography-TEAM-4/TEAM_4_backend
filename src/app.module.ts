import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { MultiModule } from './multi/multi.module';

@Module({
  imports: [RoomsModule, MultiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
