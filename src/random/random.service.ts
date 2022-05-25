import { 
    HttpException, 
    HttpStatus, 
    Injectable 
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
                throw new HttpException('Not Exist Room', HttpStatus.NOT_FOUND);
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
                    throw new HttpException('Duplicated Nickname', HttpStatus.BAD_REQUEST);
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

            const userList: Array<Member> = await this.userRepository
                .createQueryBuilder('users')
                .innerJoin('users.room', 'room', 'room.roomid = :roomid', {
                    roomid,
                })
                .getMany();

            return { userList, memberList, room };
        }
    }
}