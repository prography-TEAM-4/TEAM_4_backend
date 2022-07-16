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
    const member = new Member();
    const now = new Date();
    member.Nick = data.Nick;
    member.all = data.all;
    member.socketId = client.id;
    member.roomSocketId = client.nsp.name;
    member.createdAt = now;
    await checkCount(client, this.roomRepository);
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

  // @SubscribeMessage('test')
  // async handleTest(@MessageBody() data: { Nick: string; all: string }) {}

  afterInit(server: Server) {
    console.log('WebSockets Init');
  }

  // 이벤트 발생 시
  // @SubscribeMessage('enter')
  // handleEnter(
  //   @MessageBody() data: { nickname: string; logined: boolean; roomid: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   console.log('handleEnter');
  //   const newNamespace = client.nsp;
  //   //console.log('enter', newNamespace);
  //   console.log('join', client.nsp.name, data.roomid);

  //   newNamespace.emit(
  //     'ConnectedUsers',
  //     // Object.values(ConnectedUsers[client.nsp.name]),
  //   );

  //   client.data.roomid = data.roomid;
  //   client.data.nickname = data.nickname;
  //   client.data.logined = data.logined;

  //   client.join(`${client.nsp.name}-${data.roomid}`);
  // }

  // @SubscribeMessage('start')
  // handleStart(@ConnectedSocket() client: Socket) {
  //   console.log('handleStart');
  //   const pomo = {
  //     mode: 'pomo',
  //     cycle: 1,
  //   };
  //   this.server
  //     .to(`${client.nsp.name}-${client.data.roomid}`)
  //     .emit('start', pomo);
  // }
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() chatBody: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(chatBody);
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
  }
  // @SubscribeMessage('change')
  // handleMode(
  //   @MessageBody() pomo: { mode: string; cycle: number },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   if (pomo.mode === 'pomo') {
  //     if (pomo.cycle == 4) {
  //       const mergeImg: any = this.multiService.finishPomo(client.data.roomid);

  //       this.server
  //         .to(`${client.nsp.name}-${client.data.roomid}`)
  //         .emit('finish', mergeImg);
  //     } else {
  //       pomo.mode = 'break';
  //       this.server
  //         .to(`${client.nsp.name}-${client.data.roomid}`)
  //         .emit('change', pomo);
  //     }
  //   } else if (pomo.mode === 'break') {
  //     pomo.mode = 'pomo';
  //     pomo.cycle++;
  //     this.server
  //       .to(`${client.nsp.name}-${client.data.roomid}`)
  //       .emit('change', pomo);
  //   }
  // }

  async handleConnection(client: Socket) {
    console.log('handleConnection');
    const room = await this.roomRepository.findOne({
      where: { roomid: client.nsp.name },
    });
    if (!room) {
      client.emit('error', '없는 방입니다');
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    await removeMember(client, this.roomRepository, this.memberRepository);
    const memberArray = await this.memberRepository.find({
      where: { roomSocketId: client.nsp.name },
    });
    this.server.to(client.nsp.name).emit(
      'leave',
      memberArray.map((value) => ({ Nick: value.Nick, all: value.all })),
    );
  }
}
