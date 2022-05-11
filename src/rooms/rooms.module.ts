import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiModule } from 'src/multi/multi.module';
import { RoomRepository } from './room.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRepository]),
    MultiModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}
