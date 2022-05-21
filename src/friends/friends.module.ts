import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/Member';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiModule } from 'src/multi/multi.module';
import { OauthModule } from 'src/oauth/oauth.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomChat, User, Member]),
    MultiModule,
    OauthModule,
    ConfigService,
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
