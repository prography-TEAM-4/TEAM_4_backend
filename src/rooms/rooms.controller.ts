import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { Rooms } from 'src/entities/Rooms';
import { CreateRoomDto } from './dto/room-create.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
    constructor(private roomService: RoomsService){}

    @Post('/friends')
    async createBoard(@Body() createRoomDto: CreateRoomDto): Promise<Rooms> {
        return await this.roomService.createRoom(createRoomDto);
    }

    @Get('/friends/:id')
    async enterRoom(@Request() req): Promise<Rooms>{
        const roomid = req.params.id;

        if(!roomid){
            throw new HttpException(
                'Room id sis missing',
                HttpStatus.BAD_REQUEST,
            );
        }

        const room = await this.roomService.enterRoom(roomid);

        return room;
    }

    @Delete('/friends/:id')
    async deleteRoom(){
        
    }

}
