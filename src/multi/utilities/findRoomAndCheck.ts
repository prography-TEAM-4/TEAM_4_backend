import { WsException } from '@nestjs/websockets';
import { Room } from 'src/entities/Room';
import { Repository } from 'typeorm';

export const checkCount = async (
  roomId: string,
  roomRepository: Repository<Room>,
) => {
  const currentRoom = await roomRepository.findOne({
    where: { roomid: roomId },
  });
  if (currentRoom.headCount === 6) {
    throw new WsException('Full Room');
  }
  currentRoom.headCount++;
  await roomRepository.save(currentRoom);
};
