import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
    ){
        return this.friendsService.createFriendsRoom(body);
    }

    @ApiOperation({ summary: '친구방 가져오기'})
    @Get(':roomid')
    async getFriendsRoom(@Param('url') roomid) {
        return this.friendsService.getFriendsRoom(roomid);
    }

    /*
    @ApiOperation({ summary: '워크스페이스 특정 채널 채팅 생성하기' })
    @Post(':url/channels/:name/chats')
    async createWorkspaceChannelChats(
        @Param('url') url,
        @Param('name') name,
        @Body('content') content,
        @User() user: Users,
    ) {
        return this.friendsService.creatRoomChats(
            url,
            name,
            content,
            user.id,
        );
    }
    */
}
