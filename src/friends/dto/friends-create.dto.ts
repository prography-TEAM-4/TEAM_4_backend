import { IsNotEmpty } from "class-validator";

export class CreateFriendsRoomDto {
    @IsNotEmpty()
    roomid: string;

    @IsNotEmpty()
    host: string;
}