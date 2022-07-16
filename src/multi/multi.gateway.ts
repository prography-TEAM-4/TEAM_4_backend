import { Logger, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Member } from 'src/entities/Member';
import { Room } from 'src/entities/Room';
import { RoomChat } from 'src/entities/RoomChat';
import { Repository } from 'typeorm';
// import { MultiService } from './multi.service';
import { AllExceptionsFilter } from './utilities/AllExceptionsFilter';
import { checkCount } from './utilities/findRoomAndCheck';
import { removeMember } from './utilities/findRoomAndRemove';

//@WebSocketGateway({ namespace: /\/room-.+/ })
@WebSocketGateway({
  namespace: /.*/,
  transports: ['polling', 'websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class MultiGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(RoomChat)
    private roomChatRepository: Repository<RoomChat>,
  ) {}

  @SubscribeMessage('init')
  async handleInit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { Nick: string; all: string },
  ) {
    try {
      console.log('handle init');
      const member = new Member();
      const now = new Date();
      member.Nick = data.Nick;
      member.all = data.all;
      member.socketId = client.id;
      member.roomSocketId = client.nsp.name;
      member.createdAt = now;
      await checkCount(client, this.roomRepository);
      if (client) {
        await this.memberRepository.save(member);
        client.join(client.nsp.name);
        const memberArray = await this.memberRepository.find({
          where: { roomSocketId: client.nsp.name },
        });
        this.server.to(client.nsp.name).emit(
          'init',
          memberArray.map((value) => ({ Nick: value.Nick, all: value.all })),
        );
      }
    } catch (e) {
      console.log('error in init');
    }
  }

  afterInit(server: Server) {
    console.log('WebSockets Init');
    setInterval(() => {
      server.emit('time');
    }, 1000);
  }

  @SubscribeMessage('start')
  async handleStart(@ConnectedSocket() client: Socket) {
    try {
      console.log('handleStart');
      const room = await this.roomRepository.findOne({
        where: { roomid: client.nsp.name },
      });
      if (room.status === 'created') {
        room.status = 'starting';
        await this.roomRepository.save(room);
        this.server.to(client.nsp.name).emit('start');
      }
    } catch (e) {
      console.log('error in start');
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() chatBody: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const now = new Date();
      this.server.to(client.nsp.name).emit('message', {
        nickName: chatBody.nick,
        content: chatBody.content,
        date: now,
      });
      const message = new RoomChat();
      message.content = chatBody.content;
      message.createdAt = now;
      message.clientSocketId = client.id;
      message.roomSocketId = client.nsp.name;
      await this.roomChatRepository.save(message);
    } catch (e) {
      console.log('error in message');
    }
  }

  async handleConnection(client: Socket) {
    try {
      console.log('handleConnection');
      const room = await this.roomRepository.findOne({
        where: { roomid: client.nsp.name },
      });
      if (!room) {
        client.emit('error', '없는 방입니다');
        client.disconnect(true);
      }
    } catch (e) {
      console.log('error in connection');
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      // console.log(client);
      console.log('handleDisconnection');
      await removeMember(client, this.roomRepository, this.memberRepository);
      const memberArray = await this.memberRepository.find({
        where: { roomSocketId: client.nsp.name },
      });
      this.server.to(client.nsp.name).emit(
        'leave',
        memberArray.map((value) => ({ Nick: value.Nick, all: value.all })),
      );
    } catch (e) {
      console.log('error in disconnection');
    }
  }
}
