import {
    BaseEntity,
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  Index('id', ['id'], {});
  Index('roomid', ['roomid'], {});
  @Entity({ schema: 'prographydb', name: 'Room' })
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
  }