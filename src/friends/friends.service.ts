import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { Member } from 'src/entities/Member';
import { v4 } from 'uuid';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Room)
        private friendsRoomRepository: Repository<Room>,
        @InjectRepository(RoomChat)
        private friendsRoomChatRepository: Repository<RoomChat>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
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
            const roomid: string = v4();

            const room = new Room;
            room.roomid = roomid;
            room.host = createFriendsRoomDto.host;
            room.headCount = 0;
            room.status = "FRIENDS";
            await this.friendsRoomRepository.save(room);
            return room;
        }
        else{
            console.log('unlogined error');
        }
    }
    // 방 가져오기
    async getFriendsRoom(roomid: string, token: any, nick: string) {
        let userData: jwtParsed;
        var flag: boolean = true;

        try{
            userData = jwt.verify(token, this.config.get('secret'));
        }catch(error){
            flag = false;
        }finally {
            const room = await this.friendsRoomRepository.findOne({
                where: { roomid: roomid }
            });

            // 없는 방이거나 6명 이상인 경우
            if(!room || room.headCount >= 6){
                throw new HttpException('Not Exist Room', HttpStatus.NOT_FOUND);;
            }
            
            if(flag){
                const existUser = await this.userRepository.findOne({
                    where: { 
                        SnsId: userData.id,
                        Provider: userData.provider,
                    }
                });
                if(existUser){
                    existUser.room = room;
                    this.userRepository.save(existUser);

                    room.headCount += 1;
                    this.friendsRoomRepository.save(room);
                    return room;
                }
            }
            // 로그인을 하지 않은 유저
            const member = new Member;
            member.Nick = nick;
            member.room = room;
            this.memberRepository.save(member);

            room.headCount += 1;
            this.friendsRoomRepository.save(room);
            return { member, room };
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
            .innerJoinAndSelect('roomChats.member', 'member')
            .orderBy('roomChats.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    
    // 채팅 생성하기
    async creatFriendsRoomChats(
        token: any,
        roomid: string,
        content: string,
        memberid: number,
    ) {
        let userData: jwtParsed;
        var flag: boolean = true;
        try{
            userData = jwt.verify(token, this.config.get('secret'));
        }catch(error){
            flag = false;
        } finally{
            const room = await this.friendsRoomRepository.findOne({
                where: { roomid: roomid }
            });
            if(!room){
                console.log('없는 방');
                return new HttpException('not exist room', HttpStatus.NOT_FOUND);
            }

            const chats = new RoomChat;
            chats.content = content;
            chats.room = room;

            if(flag){
                // 로그인 유저
                const existUser = await this.userRepository.findOne({
                    where: { 
                        SnsId: userData.id,
                        Provider: userData.provider,
                    }
                });
                if(existUser){
                    chats.user = existUser;
                }
                else{
                    flag = false;
                }
            }

            if(!flag){
                const existMember = await this.memberRepository.findOne({
                    where: { id: memberid },
                });

                if(!existMember) { 
                    return new HttpException('no member', HttpStatus.NOT_FOUND); 
                }
                chats.member = existMember;
            }
            
            const saveChat = await this.friendsRoomChatRepository.save(chats);
            const chatWithUser = await this.friendsRoomChatRepository.findOne({
                where: { id: saveChat.id },
                relations: ['user', 'member', 'room']
            });

            console.log(chatWithUser.room.roomid);

            // socket.io로 해당 방 사용자에게 전송
            this.multiGatway.server
                .to(`/room-${chatWithUser.room.status}-${chatWithUser.room.roomid}`)
                .emit('message', chatWithUser);
            console.log(`/room-${chatWithUser.room.status}-${chatWithUser.room.roomid}`)
        }
    }
}
