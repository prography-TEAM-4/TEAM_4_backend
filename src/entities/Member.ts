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
@Entity({ schema: 'prographydb', name: 'Members' })
export class Member extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;
  
    @Column()
    Nick: string;
  
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

    @Column({ default: null })
    all: string;
}
  