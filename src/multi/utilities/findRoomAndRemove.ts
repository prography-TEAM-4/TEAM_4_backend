import { WsException } from '@nestjs/websockets';
import { Room } from 'src/entities/Room';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';

export const removeMember = async (
  client: Socket,
  roomRepository: Repository<Room>,
) => {
  const currentRoom = await roomRepository.findOne({
    where: { roomid: client.nsp.name },
  });
  currentRoom.headCount--;
  await roomRepository.save(currentRoom);
};
