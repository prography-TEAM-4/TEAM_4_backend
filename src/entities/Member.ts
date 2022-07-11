import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './Room';
import { RoomChat } from './RoomChat';

@Index('id', ['id'], {})
@Entity({ schema: 'prographydb', name: 'members' })
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  Nick: string;

  @Column({ nullable: true })
  all: string;

  @Column()
  socketId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Room, (room) => room.id)
  room: Room;

  @OneToMany((type) => RoomChat, (roomchat) => roomchat.member)
  roomchat: RoomChat[];
}
