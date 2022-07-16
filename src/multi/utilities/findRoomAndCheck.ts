import { WsException } from '@nestjs/websockets';
import { Room } from 'src/entities/Room';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';

export const checkCount = async (
  client: Socket,
  roomRepository: Repository<Room>,
) => {
  const currentRoom = await roomRepository.findOne({
    where: { roomid: client.nsp.name },
  });
  if (currentRoom.headCount === 6) {
    client.emit('customError', '방이 가득 찼습니다');
    client.disconnect(true);
    throw new Error('full member');
  }
  if (currentRoom.status === 'starting') {
    client.emit('customError', '이미 공부가 시작되었습니다.');
    client.disconnect(true);
    throw new Error('started');
  }
  currentRoom.headCount++;
  await roomRepository.save(currentRoom);
};
