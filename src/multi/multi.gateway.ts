import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { ConnectedSocket } from '@nestjs/websockets';
import { ConnectedUsers } from './connectedUsers';


@WebSocketGateway({ namespace: /\/ws-.+/ })
export class MultiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;


  constructor() {}

  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    // const user: User = await this.jwtService.verify(
    //   socket.handshake.query.token,
    //   true
    // );
    //this.connectedUsers = [...this.connectedUsers, String(user._id)];

    // Send list of connected users
    this.server.emit('users', ConnectedUsers);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // const user: User = await this.jwtService.verify(
    //   socket.handshake.query.token,
    //   true
    // );
    // const userPos = this.connectedUsers.indexOf(String(user._id));

    // if (userPos > -1) {
    //   this.connectedUsers = [
    //     ...this.connectedUsers.slice(0, userPos),
    //     ...this.connectedUsers.slice(userPos + 1)
    //   ];
    // }

    // Sends the new list of connected users
    this.server.emit('users', ConnectedUsers);
  }

  @SubscribeMessage('message')
  async onMessage(client, data: any) {
    const event: string = 'message';
    const result = data[0];

    //await this.roomService.addMessage(result.message, result.room);
    client.broadcast.to(result.room).emit(event, result.message);

    return Observable.create(observer =>
      observer.next({ event, data: result.message })
    );
  }

  @SubscribeMessage('join')
  async onRoomJoin(client: Socket, data: any): Promise<any> {
    // 이미 접속해있는 방일 경우 재접속 차단
    if(client.rooms.has(data[0])){
      return;
    }
    
    client.data.roomid = data[0];
    client.join(data[0]);
  }

  @SubscribeMessage('leave')
  onRoomLeave(client, data: any): void {
    client.leave(data[0]);
  }
}