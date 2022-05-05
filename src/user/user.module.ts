import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([Users]), ConfigService],
})
export class UserModule {}
