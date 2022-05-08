import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoomStatus } from "../rooms/room-status.enum";

@Entity()
export class Rooms extends BaseEntity {
    @PrimaryGeneratedColumn()
    roomid: string;

    @Column()
    host: string;

    @Column()
    headcount: number;

    @Column()
    status: string;
}