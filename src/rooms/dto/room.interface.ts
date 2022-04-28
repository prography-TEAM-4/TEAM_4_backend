import { RoomStatus } from "../room-status.enum";

export interface Room {
    roomid: string,
    headcount: number,
    status: RoomStatus,
}