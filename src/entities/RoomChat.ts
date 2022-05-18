import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member';
import { Room } from './Room';
import { User } from './User';

@Entity({ schema: 'prographydb', name: 'RoomChats' })
export class RoomChat extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'content', length: 4000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.id)
  user: User;

  @ManyToOne((type) => Member, (member) => member.id)
  member: Member;

  @ManyToOne((type) => Room, (room) => room.id)
  room: Room;
}
