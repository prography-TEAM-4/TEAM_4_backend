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
import { BookList } from './BookList';
import { Room } from './Room';
import { RoomChat } from './RoomChat';

@Index('id', ['id'], {})
@Index('SnsId', ['SnsId'], {})
@Entity({ schema: 'prographydb', name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  SnsId: string;

  @Column()
  Provider: string;

  @Column()
  Nick: string;

  @Column({ default: 0 })
  point: number;

  @Column({ nullable: true })
  all: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => BookList, (booklist) => booklist.user)
  booklists: BookList[];

  @ManyToOne((type) => Room, (room) => room.id)
  room: Room;

  @OneToMany((type) => RoomChat, (roomchat) => roomchat.user)
  roomchat: RoomChat[];
}
