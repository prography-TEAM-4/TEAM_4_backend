import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Index('id', ['id'], {})
@Entity({ schema: 'prographydb', name: 'BookLists' })
export class BookList extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column()
  face: number;

  @Column()
  arm: number;

  @Column()
  body: number;

  @Column()
  ear: number;

  @Column()
  leg: number;

  @Column()
  tail: number;

  @ManyToOne((type) => User, (user) => user.booklists)
  user: User;
}
