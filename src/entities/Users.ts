import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('id', ['id'], {})
@Index('SnsId', ['SnsId'], {})
@Index('Email', ['Email'], {})
@Entity({ schema: 'prographydb', name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  Email: string;

  @Column()
  SnsId: string;
}
