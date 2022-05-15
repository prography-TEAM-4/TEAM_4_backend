import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseIntPipe, 
    Post, 
    Query, 
    UseGuards,
    Headers } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/User';
import { LoggedInGuard } from 'src/oauth/logged-in.guard';
import { CreateFriendsRoomDto } from './dto/friends-create.dto';
import { FriendsService } from './friends.service';

@ApiTags('Multi - Friends')
@Controller('mode/friends')
export class FriendsController {
    constructor(private friendsService: FriendsService){}

    @Get()
    getFriendsRoomList(){

    }

    @ApiOperation({ summary: '친구방 만들기' })
    @Post()
    async createFriendsRoom(
        @Body() body: CreateFriendsRoomDto,
        @Headers('Authorization') token: any,
    ){
        return await this.friendsService.createFriendsRoom(body, token);
    }

    @ApiOperation({ summary: '친구방 입장하기'})
    @Post(':roomid')
    async getFriendsRoom(
        @Param('url') roomid,
        @Headers('Authorization') token: any,
    ) {
        return this.friendsService.getFriendsRoom(roomid, token);
    }

    @ApiOperation({ summary: '친구방 채팅 가져오기' })
    @Get(':roomid/chats')
    async getFriendsRoomChats(
        @Param('roomid') roomid: string,
        @Query('perPage', ParseIntPipe) perPage: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        return this.friendsService.getFriendsRoomChats(
            roomid,
            perPage,
            page,
        );
    }

    @ApiOperation({ summary: '친구방 채팅 생성하기' })
    @Post(':roomid/chats')
    async createFriendsRoomChats(
        @Param('roomid') roomid,
        @Body('content') content,
        @Body('userid') userid: number,
    ) {
        return this.friendsService.creatFriendsRoomChats(
            roomid,
            content,
            userid,
        );
    }

    @ApiOperation({ summary: '친구방 삭제하기'})
    @Delete(':rooid')
    async removeFriendsRoomChats(
        @Param('roomid') roomid,
    ){ 
        return this.friendsService.removeFriendsRoom(roomid);
    }
}
