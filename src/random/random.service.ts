import { 
    BadRequestException,
    HttpException, 
    HttpStatus, 
    Injectable, 
    NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entities/Member';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiGateway } from 'src/multi/multi.gateway';
import { jwtParsed } from 'src/user/dto/userdata.dto';
import { Not, Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { Player } from './random-mode.player';

@Injectable()
export class RandomService {
    constructor(
        @InjectRepository(Room)
        private randomRoomRepository: Repository<Room>,
        @InjectRepository(RoomChat)
        private randomRoomChatRepository: Repository<RoomChat>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        private readonly multiGatway: MultiGateway,
        private readonly config: ConfigService,
    ){}

    async createOrMatch(){
        // 들어갈 방이 있을 때 들어갈 방 리턴
        const matchRoom = await this.findRoom();

        if(matchRoom != null){
            return { result: 'matching success', matchRoom };
        }

        const roomid: string = v4();
        
        const room = new Room();
        room.roomid = roomid;
        room.host = 'RANDOM';
        room.headCount = 0;
        room.status = 'RANDOM';
        await this.randomRoomRepository.save(room);
        
        return { result: 'create success', room };
    }

    async findRoom(){
        const room = await this.randomRoomRepository.findOne({
            where: {
                status: 'RANDOM',
                headCount: Not(6),
            },
        });

        if(room){
            return room;
        } else{
            return null;
        }
    }

    async enterRoom(
        roomid: string, 
        token: any, 
        nick: string, 
        imgCode: string
    ){
        let userData: jwtParsed;
        let flag: boolean = true;

        try {
            userData = jwt.verify(token, this.config.get('secret'));
        } catch (error) {
            flag = false;
        } finally {
            const room = await this.randomRoomRepository.findOne({
                where: { roomid: roomid },
            });

            // 없는 방이거나 6명 이상인 경우
            if (!room || room.headCount >= 6) {
                // throw new HttpException(
                //     {
                //         status: HttpStatus.NOT_FOUND,
                //         error: 'Not Exist Room',
                //     }, HttpStatus.NOT_FOUND);
                throw new BadRequestException('Not Exist Room');
            }

            if (flag) {
                const existUser = await this.userRepository.findOne({
                    where: {
                        SnsId: userData.id,
                        Provider: userData.provider,
                    },
                });
                if (existUser) {
                    existUser.room = room;
                    existUser.all = imgCode;
                    await this.userRepository.save(existUser);
                }
                else{
                    flag = false
                }
            }

            // 로그인을 하지 않은 유저
            if(!flag){
                const duplicate_check = await this.memberRepository.findOne({
                    where: { Nick: nick },
                });

                if (duplicate_check) {
                    throw new BadRequestException('Duplicated Nickname');
                }

                const member = new Member();
                member.Nick = nick;
                member.room = room;
                member.all = imgCode;
                await this.memberRepository.save(member);
            }

            const memberList: Array<Member> = await this.memberRepository
                .createQueryBuilder('members')
                .innerJoin('members.room', 'room', 'room.roomid = :roomid', {
                    roomid,
                })
                .getMany();

            room.headCount += 1;
            await this.randomRoomRepository.save(room);

            const userList: Array<User> = await this.userRepository
                .createQueryBuilder('users')
                .innerJoin('users.room', 'room', 'room.roomid = :roomid', {
                    roomid,
                })
                .getMany();

                let playerList: Array<Player> = [];

                memberList.forEach((member) => {
                  playerList.push(new Player(member.id, member.Nick, member.all, -1, false));
                })
          
                userList.forEach((user) => {
                  playerList.push(new Player(user.id, user.Nick, user.all, user.point, true));
                })
          
                return { playerList, room };
        }
    }

    async removeRandomRoom(roomid: string){
        try {
            const destroyRoom = await this.randomRoomRepository.findOne({
                where: { 
                    roomid: roomid,
                    status: 'RANDOM',
                },
            });
      
            // chat 삭제
            await this.randomRoomChatRepository.delete({
                room: destroyRoom,
            });
      
            // member 삭제
            await this.memberRepository.delete({
              room: destroyRoom,
            });
      
            // user roomid 값을 null로 변경
            const users = await this.userRepository.find({
              where: { room: destroyRoom },
            });
            users.forEach(async (user) => {
              user.room = null;
              user.all = null;
              await this.userRepository.save(user);
            });
      
            // 방 삭제
            await this.randomRoomRepository.delete(destroyRoom);
            return { result: 'success' };
        } catch (error) {
            return { result: 'fail' };
        }
    }

    async getRandomRoomChats(roomid: string){
        return this.randomRoomChatRepository
            .createQueryBuilder('roomChats')
            .innerJoin('roomChats.room', 'room', 'room.roomid = :roomid', {
                roomid,
            })
            .leftJoinAndSelect('roomChats.user', 'user')
            .leftJoinAndSelect('roomChats.member', 'member')
            .orderBy('roomChats.createdAt', 'DESC')
            .take(10)
            .getMany();
    }

    async createRandomRoomChats(
        token: any,
        roomid: string,
        content: string,
        memberid: number,
    ){
        let userData: jwtParsed;
        let flag: boolean = true;
        try {
            userData = jwt.verify(token, this.config.get('secret'));
        } catch (error) {
            flag = false;
        } finally {
            const room = await this.randomRoomRepository.findOne({
                where: { roomid: roomid },
            });

            // 잘못된 roomid
            if (!room) {
                throw new BadRequestException('Not Exist Room');
            }
    
            const chats = new RoomChat();
            chats.content = content;
            chats.room = room;
            
            // 로그인 유저일 경우
            if (flag) {
                
                const existUser = await this.userRepository.findOne({
                    where: {
                        SnsId: userData.id,
                        Provider: userData.provider,
                    },
                });
                if (existUser) {
                    chats.user = existUser;
                } else {
                    flag = false;
                }
            }
            
            // 비로그인 유저일 경우
            if (!flag) {
                const existMember = await this.memberRepository.findOne({
                    where: {
                        Nick: memberid,
                        room: room,
                    },
                });
    
                if (!existMember) {
                    return new BadRequestException('no member or no user');
                }
                chats.member = existMember;
            }
    
            const saveChat = await this.randomRoomChatRepository.save(chats);
            const chatWithUser = await this.randomRoomChatRepository.findOne({
                where: { id: saveChat.id },
                relations: ['user', 'member', 'room'],
            });
    
            // socket.io로 해당 방 사용자에게 전송
            this.multiGatway.server
                .to(`/room-${chatWithUser.room.status}-${chatWithUser.room.roomid}`)
                .emit('message', chatWithUser);
            
            return { result: 'success' };
        }
    }
}