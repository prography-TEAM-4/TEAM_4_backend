import { 
    Body, 
    Controller, 
    Get, 
    Post, 
    Headers, 
    Param, 
    Delete
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RandomService } from './random.service';

@ApiTags('Multi - Random')
@Controller('mode/random')
export class RandomController {
    constructor(private randomService: RandomService){}

    // @Get()
    // getRandomRoomList(){

    // }

    @ApiResponse({ 
        description: 'Duplicate Nickname', 
        status: 400, 
        schema: { 
          example: { 
                success: false, 
                code: 400, 
                data: 'Duplicate Nickname'
            }, 
        }, 
      })
    @ApiResponse({
        description: '비로그인 유저: 랜덤방 만들기 성공',
        status: 201,
        schema: {
            example: {
                result: 'create success',
                room: {
                    id: 'id', 
                    roomid: 'b7817821-dc63-4f09-97cc-32d466701077', 
                    host: 'RANDOM', 
                    headCount: '0', 
                    status: 'RANDOM', 
                },
            },
        },
    })
    @ApiResponse({
        description: '매칭 성공',
        status: 200,
        schema: {
            example: {
                result: 'matching success',
                room: {
                    id: 'id', 
                    roomid: 'b7817821-dc63-4f09-97cc-32d466701077', 
                    host: 'member1', 
                    headCount: '5', 
                    status: 'RANDOM', 
                },
            },
        },
    })
    @ApiOperation({ summary: '랜덤매칭' })
    @Post('')
    async createOrMatchRoom(){
        return this.randomService.createOrMatch();
    }

    @ApiParam({
        name: 'roomid',
        description: '입장하려는 방 코드',
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'eyJhGcioJ와 같은 accessToken',
    })
    @ApiBody({
        description: '비로그인 유저는 닉네임, 로그인 유저는 null',
        schema: {
            example: { nick: 'example' },
        },
    })
    @ApiResponse({ 
        description: 'Duplicate Nickname', 
        status: 400, 
        schema: { 
          example: { 
                success: false, 
                code: 400, 
                data: 'Duplicate Nickname'
            }, 
        }, 
      })
    @ApiResponse({
        description: 'not exist room',
        status: 404,
        schema: {
            example: { 
                success: false, 
                code: 400, 
                data: 'Not Exist Room' 
            },
        },
    })
    @ApiResponse({
        description: '로그인 유저 - 랜덤방 입장 성공',
        status: 200,
        schema: {
            example: {
                playerList: [
                    {
                        id: '1',
                        Nick: 'exampleUser',
                        Provider: 'examplePlatform',
                        all: '1',
                        point: 0,
                        logined: true,
                    },
                    {
                        id: '1',
                        Nick: 'exampleMember',
                        all: '2',
                        point: -1,
                        logined: false,
                    },
                    {
                        id: '5',
                        Nick: 'exampleMember',
                        all: '3',
                        logined: false,
                    }
                ],
                room: [{ 
                    id: '1',
                    roomid: 'a199ead7-4dfc-429a-a62c-84b6039854ac', 
                    host: 'host', 
                    headCount: '3', 
                    status: 'FRIENDS', 
                }],
            },
        },
    })
    @ApiOperation({ summary: '랜덤방 입장하기' })
    @Post(':roomid')
    async getRandomRoom(
        @Param('roomid') roomid: string,
        @Headers('Authorization') token: any,
        @Body('nick') nick: string,
        @Body('imgCode') imgCode: string,
    ){
        return this.randomService.enterRoom(roomid, token, nick, imgCode);
    }

    @ApiParam({
        name: 'roomid',
        description: '삭제하려는 방 코드',
    })
    @ApiResponse({
        description: '랜덤방 삭제 생성 성공',
        status: 200,
        schema: {
            example: {
                result: 'success',
            },
        },
    })
    @ApiResponse({
        description: '랜덤방 삭제 생성 실패 (roomid 오류)',
        status: 404,
        schema: {
            example: {
                result: 'fail',
            },
        },
    })
    @ApiOperation({ summary: '랜덤방 삭제하기' })
    @Delete(':roomid')
    async removeFriendsRoomChats(
      @Param('roomid') roomid: string,
    ) {
      return await this.randomService.removeRandomRoom(roomid);
    }

    @ApiParam({
        name: 'roomid',
        description: '방 코드',
    })
    @ApiResponse({
        description: '랜덤방 채팅 가져오기 성공 (최근 10개의 채팅만 가져옴)',
        status: 200,
        schema: {
            example: {
                roomChats: [[
                    {
                        id: 1,
                        content: 'hi',
                        createdAt: '2022-05-23T07:27:16.467Z',
                        user: null,
                        member: [{
                            id: '1',
                            Nick: 'exampleMember',
                            all: '2',
                            createAt: '2022-05-23T07:09:54.678Z',
                            deleteAt: null,
                            updateAt: '2022-05-23T07:09:54.678Z'
                        },]
                    },
                    {
                        id: 2,
                        content: 'hello',
                        createdAt: '2022-05-23T07:27:20.467Z',
                        user: [{
                            id: '1',
                            SnsId: 'user@example.com',
                            Nick: 'exampleUser',
                            Provider: 'examplePlatform',
                            point: 0,
                            all: '1',
                            createAt: '2022-05-23T07:09:54.678Z',
                            deleteAt: null,
                            updateAt: '2022-05-23T07:09:54.678Z'
                        },],
                        member: null,
                    },
                ]],
            },
        },
    })
    @ApiOperation({ summary: '랜덤방 채팅 가져오기' })
    @Get(':roomid/chats')
    async getRandomRoomChats(
        @Param('roomid') roomid: string,
    ) {
        return await this.randomService.getRandomRoomChats(roomid);
    }
    
    @ApiHeader({
        name: 'Authorization',
        description: 'eyJhGcioJ와 같은 accessToken',
    })
    @ApiParam({
        name: 'roomid',
        description: '방 코드',
    })
    @ApiBody({
        description: '비로그인 유저는 memberId, 로그인 유저는 0',
        schema: {
            example: {
                content: 'hello',
                memberId: 3,
            },
        },
    })
    @ApiResponse({
        description: 'not exist room / no member',
        status: 400,
        schema: {
            example: { 
                success: false, 
                code: 404, 
                data: 'not exist room / no member or no user' },
        },
    })
    @ApiResponse({
        description: '랜덤방 채팅 생성 성공 (socket으로 chatWithUser 전송)',
        status: 200,
        schema: {
            example: {
                result: 'success',
            },
        },
    })
    @ApiOperation({ summary: '랜덤방 채팅 생성하기' })
    @Post(':roomid/chats')
    async createFriendsRoomChats(
        @Headers('Authorization') token: any,
        @Param('roomid') roomid: string,
        @Body('content') content: string,
        @Body('memberId') memberId: number,
    ) {
        return await this.randomService.createRandomRoomChats(
            token,
            roomid,
            content,
            memberId,
        );
    }
}
