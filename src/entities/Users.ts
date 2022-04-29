import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('UserId', ['UserId'], {})
@Index('SnsId', ['SnsId'], {})
@Index('Email', ['Email'], {})
@Entity({ schema: 'PrographyDB', name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
}
