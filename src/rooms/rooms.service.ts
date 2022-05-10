import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { MultiGateway } from 'src/multi/multi.gateway';
import { CreateRoomDto } from './dto/room-create.dto';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomRepository)
    private roomRepository: RoomRepository,
    private readonly multiGateway: MultiGateway,
  ) {}

  createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomRepository.createPrivateRoom(createRoomDto);
  }

  async enterRoom(roomid: string): Promise<Room> {
    const enter = await this.roomRepository.findOne(roomid);

    if (!enter) {
      throw new NotFoundException(`Cannot find Room with id: ${roomid}`);
    }
    return enter;
  }

  async deleteRoom(roomid: string): Promise<void> {
    const result = await this.roomRepository.delete(roomid);

    if (result.affected === 0) {
      throw new NotFoundException(`Cannot find Board with id ${roomid}`);
    }

    console.log('result', result);
  }
}
