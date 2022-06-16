import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/Member';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiGateway } from './multi.gateway';
import { MultiService } from './multi.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User , Member, Room, RoomChat]),
    ],
    providers: [MultiGateway, MultiService],
    exports: [MultiGateway],
})
export class MultiModule {}
