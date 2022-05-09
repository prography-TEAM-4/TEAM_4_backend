import { Entity, EntityRepository, Repository } from "typeorm";
import { RoomStatus } from "./room-status.enum";
import { Room } from "src/entities/Room";
import { CreateRoomDto } from "./dto/room-create.dto";

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
    async createPrivateRoom(createRoomDto: CreateRoomDto): Promise<Room> {
        const { roomid, host } = createRoomDto;

        const room = this.create({
            roomid,
            host,
            headCount: 1,
            status: RoomStatus.FRIENDS,
        });

        await this.save(room);
        return room;
    }

    async createPublicRoom(createRoomDto: CreateRoomDto): Promise<Room> {
        const { roomid, host } = createRoomDto;

        const room = this.create({
            roomid,
            host,
            headCount: 1,
            status: RoomStatus.RANDOM,
        });

        await this.save(room);
        return room;
    }
}