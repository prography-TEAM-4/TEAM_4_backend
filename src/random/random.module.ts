import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomController } from './random.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomChat } from 'src/entities/RoomChat';
import { Room } from 'src/entities/Room';
import { User } from 'src/entities/User';
import { ConfigService } from '@nestjs/config';
import { MultiModule } from 'src/multi/multi.module';
import { OauthModule } from 'src/oauth/oauth.module';
import { Member } from 'src/entities/Member';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomChat, User, Member]),
    MultiModule,
    OauthModule,
    ConfigService,
  ],
  providers: [RandomService],
  controllers: [RandomController],
})
export class RandomModule {}
