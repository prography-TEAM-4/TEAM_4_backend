import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { ConfigService } from '@nestjs/config';
import { BookList } from 'src/entities/BookList';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, BookList]), ConfigService],
})
export class UserModule {}
