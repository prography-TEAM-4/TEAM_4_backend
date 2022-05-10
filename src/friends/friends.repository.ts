import { EntityRepository, Repository } from 'typeorm';
import { Room } from 'src/entities/Room';
import { CreateFriendsRoomDto } from './dto/friends-create.dto';

@EntityRepository(Room)
export class FriendsRoomRepository extends Repository<Room> {
    async createPrivateRoom(createFriendsRoomDto: CreateFriendsRoomDto): Promise<Room> {
          const { roomid, host } = createFriendsRoomDto;

          const room = this.create({
            roomid,
              host,
              headCount: 1,
              status: "FRIENDS",
          });

          await this.save(room);
          return room;
    }
}
