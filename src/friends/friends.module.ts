import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiModule } from 'src/multi/multi.module';
import { OauthModule } from 'src/oauth/oauth.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomChat, User, ConfigService]),
    MultiModule,
    OauthModule
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
