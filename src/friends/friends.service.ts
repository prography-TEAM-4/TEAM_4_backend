import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { MultiGateway } from 'src/multi/multi.gateway';
import { jwtParsed } from 'src/user/dto/userdata.dto';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Member } from 'src/entities/Member';
import { v4 } from 'uuid';
import { Player } from './friends-Mode.player';
import { parseJWT } from 'src/commom/utility/parseJWT';

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
  async createFriendsRoom(nick: string, token: any) {
    let userData: jwtParsed;
    let flag: boolean = true;
    try {
      userData = parseJWT(token, this.config.get('SECRET'));
    } catch (error) {
      //throw new UnauthorizedException(`unauthorized error`);
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
          room.status = 'FRIENDS';
          await this.friendsRoomRepository.save(room);
          return room;
        }
      }
      // 테스트용: 비로그인 시에도 가능하게끔
      else {
        // 중복 닉네임 예외처리
        const duplicate_check = await this.memberRepository.findOne({
          where: { Nick: nick },
        });

        if (duplicate_check) {
          throw new BadRequestException('Duplicated Nickname');
        }

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
    }
  }
  // 방 가져오기
  async getFriendsRoom(
    roomid: string,
    token: any,
    nick: string,
    imgCode: string,
  ) {
    let userData: jwtParsed;
    let flag: boolean = true;
    let enterUser: Player;
    try {
      userData = parseJWT(token, this.config.get('SECRET'));
    } catch (error) {
      flag = false;
    } finally {
      const room = await this.friendsRoomRepository.findOne({
        where: { roomid: roomid },
      });

      // 없는 방이거나 6명 이상인 경우
      if (!room || room.headCount >= 6) {
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

          room.headCount += 1;
          await this.friendsRoomRepository.save(room);
          enterUser = new Player(
            existUser.id,
            existUser.Nick,
            existUser.all,
            existUser.point,
            true,
          );
        } else {
          flag = false;
        }
      }

      if (!flag) {
        // 로그인을 하지 않은 유저
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
        enterUser = new Player(member.id, member.Nick, member.all, -1, false);
      }

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
  }

  async removeFriendsRoom(roomid: string) {
    try {
      const destroyRoom = await this.friendsRoomRepository.findOne({
        where: { roomid: roomid },
      });

      // chat 삭제
      await this.friendsRoomChatRepository.delete({
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
      await this.friendsRoomRepository.delete(destroyRoom);
      return { result: 'success' };
    } catch (error) {
      return { result: 'fail' };
    }
  }

  async getFriendsRoomChats(roomid: string) {
    return this.friendsRoomChatRepository
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

  // 채팅 생성하기
  async creatFriendsRoomChats(
    token: any,
    roomid: string,
    content: string,
    nick: string,
  ) {
    let userData: jwtParsed;
    let flag: boolean = true;
    try {
      userData = parseJWT(token, this.config.get('SECRET'));
    } catch (error) {
      flag = false;
    } finally {
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

      if (flag) {
        // 로그인 유저
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

      if (!flag) {
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
      }

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
}
