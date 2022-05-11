import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { MultiModule } from 'src/multi/multi.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    MultiModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
