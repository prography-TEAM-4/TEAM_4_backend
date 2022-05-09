import { IsNotEmpty } from "class-validator";
import { RoomStatus } from "../room-status.enum";


export class CreateRoomDto {
    @IsNotEmpty()
    roomid: string;

    @IsNotEmpty()
    host: string;
}