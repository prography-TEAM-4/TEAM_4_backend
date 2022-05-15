import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiGateway } from 'src/multi/multi.gateway';
import { jwtParsed } from 'src/user/dto/userdata.dto';
import { Repository } from 'typeorm';
import { CreateFriendsRoomDto } from './dto/friends-create.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Room)
        private friendsRoomRepository: Repository<Room>,
        @InjectRepository(RoomChat)
        private friendsRoomChatRepository: Repository<RoomChat>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly multiGatway: MultiGateway,
        private readonly config: ConfigService,
    ){}

    // 방 만들기
    async createFriendsRoom(createFriendsRoomDto: CreateFriendsRoomDto, token: any){
        let userData: jwtParsed;
        try{
            userData = jwt.verify(token, this.config.get('secret'));
        }catch(error){
            throw new UnauthorizedException(`unauthorized error`);
        }

        const existUser = await this.userRepository.findOne({
            where: { 
                SnsId: userData.id,
                Provider: userData.provider,
            }
        });

        // 로그인 한 경우 가능
        if(existUser){
            const room = new Room;
            room.roomid = createFriendsRoomDto.roomid;
            room.host = createFriendsRoomDto.host;
            room.headCount = 1;
            room.status = "FRIENDS";
            return await this.friendsRoomRepository.save(room);
        }
        else{
            console.log('unauthorized error');
        }
    }
    // 방 가져오기
    async getFriendsRoom(roomid: string, token: any) {
        let userData: jwtParsed;
        try{
            userData = jwt.verify(token, this.config.get('secret'));
        }catch(error){
            throw new UnauthorizedException(`unauthorized error`);
        }

        const existUser = await this.userRepository.findOne({
            where: { 
                SnsId: userData.id,
                Provider: userData.provider,
            }
        });

        const room = await this.friendsRoomRepository.findOne(roomid);

        // 없는 방이거나 6명 이상인 경우
        if(!room || room.headCount >= 6){
            return;
        }

        if(existUser){
            existUser.room = room;
            room.headCount += 1;
            this.friendsRoomRepository.save(room);
            return room;
        }
        // 로그인을 하지 않은 경우는 어떻게...?
        else{
            return room;
        }
    }

    async removeFriendsRoom(roomid: string){
        return this.friendsRoomRepository.delete(roomid);
    }

    async getFriendsRoomChats(
        roomid: string,
        perPage: number,
        page: number,
    ) {
        return this.friendsRoomChatRepository
            .createQueryBuilder('roomChats')
            .innerJoin('roomChats.room', 'room', 'room.roomid = :roomid', {
                roomid,
            })
            .innerJoinAndSelect('roomChats.user', 'user')
            .orderBy('roomChats.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    
    // 채팅 생성하기
    async creatFriendsRoomChats(
        roomid: string,
        content: string,
        userid: number,
    ) {
        const room = await this.friendsRoomRepository.findOne({
            where: { roomid: roomid }
        });
        const user = await this.userRepository.findOne(userid);

        if(!room){
            console.log('없는 방');
        }

        if(!user){
            console.log('없는 사람');
        }
        const chats = new RoomChat;
        chats.content = content;
        chats.user = user;
        chats.room = room;

        const saveChat = await this.friendsRoomChatRepository.save(chats);
        const chatWithUser = await this.friendsRoomChatRepository.findOne({
            where: { id: saveChat.id },
            relations: ['user', 'room']
        });

        console.log(chatWithUser.room.roomid);

        // socket.io로 해당 방 사용자에게 전송
        this.multiGatway.server
            .to(`/room-${chatWithUser.room.status}-${chatWithUser.room.roomid}`)
            .emit('message', chatWithUser);
        console.log(`/room-${chatWithUser.room.status}-${chatWithUser.room.roomid}`)
    }
}
