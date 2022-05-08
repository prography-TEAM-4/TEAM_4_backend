import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from 'src/entities/Rooms';
import { CreateRoomDto } from './dto/room-create.dto';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(RoomRepository)
        private roomRepository: RoomRepository,
    ){}

    createRoom(createRoomDto: CreateRoomDto) : Promise<Rooms> {
        return this.roomRepository.createPrivateRoom(createRoomDto);
    }

    async enterRoom(roomid: string): Promise<Rooms>{
        const enter = await this.roomRepository.findOne(roomid);

        if(!enter){
            throw new NotFoundException(`Cannot find Room with id: ${roomid}`)
        }
        return enter;
    }

    async deleteRoom(roomid: string): Promise<void>{
        const result = await this.roomRepository.delete(roomid);

        if(result.affected === 0){
            throw new NotFoundException(`Cannot find Board with id ${roomid}`);
        }

        console.log('result', result);
    }
}
