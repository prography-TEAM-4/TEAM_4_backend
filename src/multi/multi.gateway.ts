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
import { Repository } from 'typeorm';
import { MultiService } from './multi.service';
import { AllExceptionsFilter } from './utilities/AllExceptionsFilter';
import { checkCount } from './utilities/findRoomAndCheck';

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
    private multiService: MultiService,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  @SubscribeMessage('init')
  async handleInit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { Nick: string; all: string },
  ) {
    const member = new Member();
    member.Nick = data.Nick;
    member.all = data.all;
    member.socketId = client.id;
    await checkCount(client, this.roomRepository);
    await this.memberRepository.save(member);
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
    // console.log('handleDisconnection');
    // console.log('Disconnected', client.nsp.name);
    // const nspName = client.nsp.name;
    // const nsp = client.nsp;
    // // delete ConnectedUsers[client.nsp.name][client.id];
    // // 나간 사람 DB에서 데이터 수정(user) 또는 삭제(member)
    // const { success, room } = await this.multiService.leaveRoom(
    //   client.data.roomid,
    //   client.data.nickname,
    //   client.data.logined,
    // );
    // console.log(
    //   `client ${client.data.nickname} leaved ${nspName}-${client.data.roomid}`,
    // );
    // // nsp.emit('connectedList', Object.values(ConnectedUsers[client.nsp.name]));
    // this.server.to(`${nspName}-${client.data.roomid}`).emit('leave', {
    //   room,
    //   data: {
    //     nickname: client.data.nickname,
    //     logined: client.data.logined,
    //   },
    // });
    // @UseFilters(new AllExceptionsFilter())
    // @SubscribeMessage('events')
    // testing(client,data : any){
    //   const event='events';
    //   return {event,data};
    // }
  }
}
