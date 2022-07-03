import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateImageCode } from 'src/commom/utility/generateImageCode';
import { Member } from 'src/entities/Member';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class MultiService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomChat)
    private roomChatRepository: Repository<RoomChat>,
  ) {}

  async leaveRoom(roomid: string, nick: string, logined: boolean) {
    try {
      const room = await this.roomRepository.findOne({
        where: { roomid: roomid },
      });

      let player: any;
      let flag: boolean = false;

      if (logined) {
        player = await this.userRepository.findOne({
          where: { SnsId: nick },
        });
        this.handlException(room, player);
        player.room = null;
        await this.userRepository.save(player);

        if (player.SnsId === room.host) {
          flag = true;
        }

        const roomChats = await this.roomChatRepository.find({
          where: {
            user: player,
            room: room,
          },
        });
        this.handleRoomchat(roomChats, null, player);
      } else {
        player = await this.memberRepository.findOne({
          where: { Nick: nick },
        });
        this.handlException(room, player);

        if (player.nick === room.host) {
          flag = true;
        }

        const roomChats = await this.roomChatRepository.find({
          where: {
            member: player,
            room: room,
          },
        });
        this.handleRoomchat(roomChats, player, null);
        await this.memberRepository.remove(player);
      }
      room.headCount--;

      // 호스트가 나갔을 때
      if (flag) {
        const new_host = await this.userRepository.findOne({
          where: { room: room },
        });

        if (new_host) {
          room.host = new_host.SnsId;
        } else {
          const new_host = await this.memberRepository.findOne({
            where: { room: room },
          });
          room.host = new_host.Nick;
        }
      }
      await this.roomRepository.save(room);
      return { success: true, room };
    } catch (error) {
      return { success: false };
    }
  }

  handlException(room: Room, player: any) {
    if (!room || !player) {
      throw new BadRequestException('Bad Reqeust');
    }
  }

  async handleRoomchat(roomChats: RoomChat[], member: Member, user: User) {
    roomChats.forEach((chat) => {
      if (chat.user === user) {
        chat.user = null;
      }
      if (chat.member === member) {
        chat.member = null;
      }
    });
    await this.roomChatRepository.save(roomChats);
  }

  async finishPomo(roomid: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: { roomid: roomid },
      });

      if (!room) {
        throw new BadRequestException('Not Exist Room');
      }

      const member = await this.memberRepository.find({
        where: { room: room },
        select: ['all'],
      });

      const user = await this.userRepository.find({
        where: { room: room },
        select: ['all'],
      });

      const idList: number[] = [];

      member.forEach((member) => {
        idList.push(parseInt(member.all));
      });

      user.forEach((user) => {
        idList.push(parseInt(user.all));
      });

      const mergeImg: string = generateImageCode(idList);

      return { success: true, mergeImg };
    } catch (error) {
      return { success: false };
    }
  }
}
