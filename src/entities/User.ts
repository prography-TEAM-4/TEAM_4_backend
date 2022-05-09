import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookList } from './BookList';

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

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => BookList, (booklist) => booklist.user)
  booklists: BookList[];
}
