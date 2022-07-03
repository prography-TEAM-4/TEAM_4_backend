import { IoAdapter } from '@nestjs/platform-socket.io';

// Websocket으로 서버가 생성된 부분을 Socket.io 서버로 변경
export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);

    return server;
  }
}
