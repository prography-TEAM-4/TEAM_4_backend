import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Room)
    private friendsRoomRepository: Repository<Room>,
  ) {}

  // 방 만들기
  async createFriendsRoom() {
    console.log('createFriendsRoom');

    const roomid: string = v4();

    const room = new Room();
    room.roomid = '/' + roomid;
    room.headCount = 0;
    room.status = 'created';
    room.type = 'FRIENDS';
    try {
      await this.friendsRoomRepository.save(room);
    } catch (e) {
      throw new NotFoundException('db error');
    }
    return roomid;
  }
}
