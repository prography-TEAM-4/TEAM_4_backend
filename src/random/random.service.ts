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

    async createOrMatch(token: any, nick: string){
        // 들어갈 방이 있을 때 들어갈 방 리턴
        const matchRoom = await this.findRoom();
        console.log(matchRoom)
        if(matchRoom != null){
            return { result: 'matching success', matchRoom };
        }

        let userData: jwtParsed;
        let flag: boolean = true;

        try {
            userData = jwt.verify(token, this.config.get('secret'));
        } catch (error) {
            flag = false;
        } finally {
            if (flag) {
                const existUser = await this.userRepository.findOne({
                    where: {
                        SnsId: userData.id,
                        Provider: userData.provider,
                    },
                });
        
                // 로그인 한 경우 가능
                if (existUser) {
                    const roomid: string = v4();
        
                    const room = new Room();
                    room.roomid = roomid;
                    room.host = existUser.SnsId;
                    room.headCount = 0;
                    room.status = 'RANDOM';
                    await this.randomRoomRepository.save(room);
                    return { result: 'create success', room };
                }
            }

            else {
                // 중복 닉네임 예외처리
                const duplicate_check = await this.memberRepository.findOne({
                    where: { Nick: nick },
                });
  
                if (duplicate_check) {
                    throw new HttpException('Duplicated Nickname', HttpStatus.BAD_REQUEST);
                }

                const roomid: string = v4();
        
                const room = new Room();
                room.roomid = roomid;
                room.host = nick;
                room.headCount = 0;
                room.status = 'RANDOM';
                await this.randomRoomRepository.save(room);
        
                const member = new Member();
                member.Nick = nick;
                await this.memberRepository.save(member);
                return { result: 'create success', room };
            }
        }
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
}