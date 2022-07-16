import { WsException } from '@nestjs/websockets';
import { Room } from 'src/entities/Room';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { Member } from 'src/entities/Member';

export const removeMember = async (
  client: Socket,
  roomRepository: Repository<Room>,
  memberRepository: Repository<Member>,
) => {
  const member = await memberRepository.findOne({
    where: { socketId: client.id, roomSocketId: client.nsp.name },
  });
  await memberRepository.remove(member);
  const currentRoom = await roomRepository.findOne({
    where: { roomid: client.nsp.name },
  });
  currentRoom.headCount--;
  await roomRepository.save(currentRoom);
};
