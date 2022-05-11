import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { MultiGateway } from 'src/multi/multi.gateway';
import { CreateFriendsRoomDto } from './dto/friends-create.dto';
import { FriendsRoomRepository } from './friends.repository';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Room)
        private friendsRoomRepository: FriendsRoomRepository,
        private readonly multiGatway: MultiGateway,
    ){}

    // 방 만들기
    async createFriendsRoom(createFriendsRoomDto: CreateFriendsRoomDto){
        await this.friendsRoomRepository.createPrivateRoom(createFriendsRoomDto);
    }

    // 방 가져오기
    async getFriendsRoom(roomid: string) {
        return this.friendsRoomRepository.findOne(roomid);
    }
    /*
    async creatRoomChats(
        roomid: string,
        name: string,
        content: string,
        userid: number,
    ) {
        const room = await this.friendsRoomRepository.findOne(roomid);
        const chats = new 채팅엔티티;
        chats.content = content;
        chats.UserId = userid;
        chats.roomId = room.id;
        const saveChat = await this.roomChatsRepository.save(chats);
        const chatWithUser = await this.roomChatsRepository.findOne({
            where: { id: saveChat.id },
            relations: ['User', 'Room'],
        });
        this.multiGatway.server
            // .of(`/ws-${url}`)
            .to(`/ws-friends-${chatWithUser.ChannelId}`)
            .emit('message', chatWithUser);
    }
    */
}
