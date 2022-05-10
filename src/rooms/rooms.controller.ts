import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Request,
} from '@nestjs/common';
import { Room } from 'src/entities/Room';
import { CreateRoomDto } from './dto/room-create.dto';
import { RoomsService } from './rooms.service';

@Controller('mode/matching')
export class RoomsController {
  constructor(private roomService: RoomsService) {}

  @Post('/friends')
  async createBoard(@Body() createRoomDto: CreateRoomDto): Promise<void> {
    const room = await this.roomService.createRoom(createRoomDto);

    Redirect(`/rooms/friends/${room.roomid}`);
  }

  @Get('/friends/:id')
  async enterRoom(@Request() req): Promise<Room> {
    const roomid = req.params.id;

    if (!roomid) {
      throw new HttpException('Room id sis missing', HttpStatus.BAD_REQUEST);
    }

    const room = await this.roomService.enterRoom(roomid);

    return room;
  }

  @Delete('/friends/:id')
  async deleteRoom(@Param('id') id: string) {
    return this.roomService.deleteRoom(id);
  }
}
