import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiGateway } from 'src/multi/multi.gateway';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Member } from 'src/entities/Member';
import { v4 } from 'uuid';
import { Player } from './friends-Mode.player';

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
  ) {}

  // 방 만들기
  async createFriendsRoom(nick: string) {
    console.log('createFriendsRoom');
    // 중복 닉네임 예외처리
    //data에다가 uuid 박기
    // const duplicate_check = await this.memberRepository.findOne({
    //   where: { Nick: nick },
    // });

    // if (duplicate_check) {
    //   throw new BadRequestException('Duplicated Nickname');
    // }

    const roomid: string = v4();

    const room = new Room();
    room.roomid = roomid;
    room.host = nick;
    room.headCount = 0;
    room.status = 'FRIENDS';
    await this.friendsRoomRepository.save(room);

    // 바로 입장을 진행하기 때문에 member 생성은 방 입장 시 진행
    // const member = new Member();
    // member.Nick = nick;
    // await this.memberRepository.save(member);
    return room;
  }
  // 방 가져오기
  async getFriendsRoom(roomid: string, nick: string, imgCode: string) {
    let enterUser: Player;
    const room = await this.friendsRoomRepository.findOne({
      where: { roomid: roomid },
    });
    console.log('getFriendsRoom');
    // 없는 방이거나 6명 이상인 경우
    // 임시 테스트
    if (!room || room.headCount >= 6) {
      throw new BadRequestException('Not Exist Room');
    }

    // 로그인을 하지 않은 유저
    // 이 부분도 추후 변경 필요. 중복 확인 설정 나중에
    // const duplicate_check = await this.memberRepository.findOne({
    //   where: { Nick: nick },
    // });

    // if (duplicate_check) {
    //   throw new BadRequestException('Duplicated Nickname');
    // }

    const member = new Member();
    member.Nick = nick;
    member.room = room;
    member.all = imgCode;
    await this.memberRepository.save(member);
    enterUser = new Player(member.id, member.Nick, member.all, -1, false);

    const memberList = await this.memberRepository
      .createQueryBuilder('members')
      .innerJoin('members.room', 'room', 'room.roomid = :roomid', {
        roomid,
      })
      .getMany();

    room.headCount += 1;
    await this.friendsRoomRepository.save(room);

    const userList = await this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.room', 'room', 'room.roomid = :roomid', {
        roomid,
      })
      .getMany();

    let playerList: Array<Player> = [];

    memberList.forEach((member) => {
      playerList.push(
        new Player(member.id, member.Nick, member.all, -1, false),
      );
    });

    userList.forEach((user) => {
      playerList.push(
        new Player(user.id, user.Nick, user.all, user.point, true),
      );
    });

    this.multiGatway.server
      .to(`/room-${room.status}-${room.roomid}`)
      .emit('join', enterUser);
    return { playerList, room };
  }

  // 채팅 생성하기
  async creatFriendsRoomChats(roomid: string, content: string, nick: string) {
    const room = await this.friendsRoomRepository.findOne({
      where: { roomid: roomid },
    });
    if (!room) {
      console.log('no Exist Room');
      return new BadRequestException('Not Exist Room');
    }

    const chats = new RoomChat();
    chats.content = content;
    chats.room = room;

    const existMember = await this.memberRepository.findOne({
      where: {
        Nick: nick,
        room: room,
      },
    });

    if (!existMember) {
      return new BadRequestException('no member');
    }
    chats.member = existMember;

    const saveChat = await this.friendsRoomChatRepository.save(chats);
    const chatWithUser = await this.friendsRoomChatRepository.findOne({
      where: { id: saveChat.id },
      relations: ['user', 'member', 'room'],
    });

    console.log(chatWithUser.room.roomid);

    // socket.io로 해당 방 사용자에게 전송
    this.multiGatway.server
      .to(`/room-${chatWithUser.room.status}-${chatWithUser.room.roomid}`)
      .emit('message', chatWithUser);

    return { result: 'success' };
  }
}
