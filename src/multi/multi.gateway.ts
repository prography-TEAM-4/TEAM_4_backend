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
import { ConnectedUsers } from './connectedUsers';
import { MultiService } from './multi.service';

//@WebSocketGateway({ namespace: /\/room-.+/ })
@WebSocketGateway({
  namespace: /\/room-.+/,
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

  constructor(private multiService: MultiService){}

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  afterInit(server: Server) {
    console.log('WebSockets Init');
  }

  // 이벤트 발생 시
  @SubscribeMessage('enter')
  handleEnter(
    @MessageBody() data: { nickname: string, logined: boolean, roomid: string },
    @ConnectedSocket() client: Socket,
  ) {
    const newNamespace = client.nsp;
    console.log('enter', newNamespace);
    console.log('join', client.nsp.name, data.roomid);

    ConnectedUsers[client.nsp.name][client.id] = data.nickname;
    newNamespace.emit('ConnectedUsers', Object.values(ConnectedUsers[client.nsp.name]));

    client.data.roomid = data.roomid;
    client.data.nickname = data.nickname;
    client.data.logined = data.logined;  

    client.join(`${client.nsp.name}-${data.roomid}`);
    this.server.sockets.adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    })
  }

  @SubscribeMessage('start')
  handleStart(
    @ConnectedSocket() client: Socket,
  ) {
    const pomo = {
      mode: 'pomo',
      cycle: 1,
    };
    this.server.to(`${client.nsp.name}-${client.data.roomid}`).emit('start', pomo);
  }

  @SubscribeMessage('change')
  handleMode(
    @MessageBody() pomo: { mode: string, cycle: number },
    @ConnectedSocket() client: Socket,
  ){
    if(pomo.mode === 'pomo'){
      if(pomo.cycle == 4){
        const mergeImg: any = this.multiService.finishPomo(client.data.roomid)

        this.server.to(`${client.nsp.name}-${client.data.roomid}`).emit('finish', mergeImg);
      }
      else{
        pomo.mode = 'break';
        this.server.to(`${client.nsp.name}-${client.data.roomid}`).emit('change', pomo);
      }
    }
    else if(pomo.mode === 'break'){
      pomo.mode = 'pomo';
      pomo.cycle++;
      this.server.to(`${client.nsp.name}-${client.data.roomid}`).emit('change', pomo);
    }
  }

  handleConnection(client: Socket) {
    console.log('connected', client.nsp.name);

    if (!ConnectedUsers[client.nsp.name]) {
      ConnectedUsers[client.nsp.name] = {};
    }
    console.log(ConnectedUsers);
    client.emit('connected', client.nsp.name);
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected', client.nsp.name);
    
    const nspName = client.nsp.name;
    const nsp = client.nsp;
    delete ConnectedUsers[client.nsp.name][client.id];

    // 나간 사람 DB에서 데이터 수정(user) 또는 삭제(member)
    const room: any = this.multiService.leaveRoom(client.data.roomid, client.data.nickname, client.data.logined);

    console.log(`client ${client.data.nickname} leaved ${nspName}-${client.data.roomid}`);
    nsp.emit('connectedList', Object.values(ConnectedUsers[client.nsp.name]));

    this.server.to(`${nspName}-${client.data.roomid}`).emit('leave', { 
      room,
      data: { 
        nickname: client.data.nickname, 
        logined: client.data.logined,
      } 
    });
  }
}
