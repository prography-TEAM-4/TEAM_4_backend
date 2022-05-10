import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomChat } from './Roomchat';
import { User } from './User';

Index('id', ['id'], {});
Index('roomid', ['roomid'], {});
@Entity({ schema: 'prographydb', name: 'Rooms' })
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  roomid: string;

  @Column()
  host: string;

  @Column()
  headCount: number;

  @Column()
  status: string;

  @OneToMany((type) => User, (user) => user.room)
  User: User[];

  @OneToMany((type) => RoomChat, (roomchat) => roomchat.room)
  roomchat: RoomChat[];
}
