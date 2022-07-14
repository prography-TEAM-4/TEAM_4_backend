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
    client.emit('error', '방이 가득 찼습니다');
    client.disconnect(true);
  }
  currentRoom.headCount++;
  await roomRepository.save(currentRoom);
};
