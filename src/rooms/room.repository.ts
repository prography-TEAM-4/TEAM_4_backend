import { Entity, EntityRepository, Repository } from "typeorm";
import { RoomStatus } from "./room-status.enum";
import { Rooms } from "src/entities/Rooms";
import { CreateRoomDto } from "./dto/room-create.dto";

@EntityRepository(Rooms)
export class RoomRepository extends Repository<Rooms> {
    async createPrivateRoom(createRoomDto: CreateRoomDto): Promise<Rooms> {
        const { roomid, host } = createRoomDto;

        const room = this.create({
            roomid,
            host,
            headcount: 1,
            status: RoomStatus.FRIENDS,
        });

        await this.save(room);
        return room;
    }

    async createPublicRoom(createRoomDto: CreateRoomDto): Promise<Rooms> {
        const { roomid, host } = createRoomDto;

        const room = this.create({
            roomid,
            host,
            headcount: 1,
            status: RoomStatus.RANDOM,
        });

        await this.save(room);
        return room;
    }
}