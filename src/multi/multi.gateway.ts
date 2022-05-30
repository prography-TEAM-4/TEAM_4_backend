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

//@WebSocketGateway({ namespace: /\/room-.+/ })
@WebSocketGateway({
  namespace: /\/room-.+/,
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class MultiGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

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
    @MessageBody() data: { id: number; roomid: string },
    @ConnectedSocket() client: Socket,
  ) {
    const newNamespace = client.nsp;
    console.log('enter', newNamespace);
    ConnectedUsers[client.nsp.name][client.id] = data.id;
    newNamespace.emit(
      'ConnectedUsers',
      Object.values(ConnectedUsers[client.nsp.name]),
    );
    console.log('join', client.nsp.name, data.roomid);
    client.join(`${client.nsp.name}-${data.roomid}`);
    this.server.sockets.adapter.on('join-room', (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });
  }

  @SubscribeMessage('start')
  handleStart(
    @MessageBody() roomid: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`/room-${client.nsp.name}-${roomid}`).emit('start', 'start');
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

    const nsp = client.nsp;
    delete ConnectedUsers[client.nsp.name][client.id];
    console.log(ConnectedUsers);
    nsp.emit('connectedList', Object.values(ConnectedUsers[client.nsp.name]));
  }

  // 임시로 구현
  @SubscribeMessage('sendMessage')
  sendMessage(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { roomid: string, nick: string, content: string},
  ) {
    client.to(`/room-${client.nsp.name}-${data.roomid}`).emit('getMessage', {
      nick: data.nick,
      content: data.content,
    });
  }
}
