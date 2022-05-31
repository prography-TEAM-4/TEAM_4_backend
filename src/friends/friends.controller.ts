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
  Headers,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FriendsService } from './friends.service';

@ApiTags('Multi - Friends')
@Controller('mode/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  // @Get()
  // getFriendsRoomList(){

  // }

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
    description: 'unauthorized error',
    status: 401,
    schema: {
      example: { success: false, code: 401, data: 'unauthorized error' },
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
    description: '로그인 유저: 친구방 만들기 성공',
    status: 200,
    schema: {
      example: {
        room: {
          id: '1', 
          roomid: 'a199ead7-4dfc-429a-a62c-84b6039854ac', 
          host: 'user@example.com', 
          headCount: '0', 
          status: 'FRIENDS', 
        },
      },
    },
  })
  @ApiResponse({
    description: '비로그인 유저: 친구방 만들기 성공 (테스트용)',
    status: 200,
    schema: {
      example: {
        room: {
          id: 'id',
          roomid: 'a199ead7-4dfc-429a-a62c-84b6039854ac',
          host: 'member1',
          headCount: '0',
          status: 'FRIENDS',
        },
      },
    },
  })
  @ApiOperation({ summary: '친구방 만들기' })
  @Post('')
  async createFriendsRoom(
    @Headers('Authorization') token: any,
    @Body('nick') nick: string,
  ) {
    return await this.friendsService.createFriendsRoom(nick, token);
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
    description: 'not exist room',
    status: 404,
    schema: {
      example: { 
        success: false, 
        code: 400, 
        data: 'Not Exist Room' },
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
    description: '로그인 유저 - 친구방 입장 성공',
    status: 200,
    schema: {
      example: {
        playerList: [
          {
            id: '1',
            Nick: 'exampleUser',
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
            point: -1,
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
  @ApiOperation({ summary: '친구방 입장하기' })
  @Post(':roomid')
  async getFriendsRoom(
    @Param('roomid') roomid: string,
    @Headers('Authorization') token: any,
    @Body('nick') nick: string,
    @Body('imgCode') imgCode: string,
  ) {
    return await this.friendsService.getFriendsRoom(
      roomid,
      token,
      nick,
      imgCode,
    );
  }

  @ApiParam({
    name: 'roomid',
    description: '방 코드',
  })
  @ApiResponse({
    description: '친구방 채팅 가져오기 성공 (최근 10개의 채팅만 가져옴)',
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
  @ApiOperation({ summary: '친구방 채팅 가져오기' })
  @Get(':roomid/chats')
  async getFriendsRoomChats(@Param('roomid') roomid: string) {
    return await this.friendsService.getFriendsRoomChats(roomid);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'eyJhGcioJ와 같은 accessToken',
  })
  @ApiParam({
    name: 'roomid',
    description: '입장하려는 방 코드',
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
    status: 404,
    schema: {
      example: { success: false, code: 404, data: 'unknown error' },
    },
  })
  @ApiResponse({
    description: '친구방 채팅 생성 성공 (socket으로 chatWithUser 전송)',
    status: 200,
    schema: {
      example: {
        result: 'success',
      },
    },
  })
  @ApiOperation({ summary: '친구방 채팅 생성하기' })
  @Post(':roomid/chats')
  async createFriendsRoomChats(
    @Headers('Authorization') token: any,
    @Param('roomid') roomid: string,
    @Body('content') content: string,
    @Body('memberId') memberId: number,
  ) {
    return await this.friendsService.creatFriendsRoomChats(
      token,
      roomid,
      content,
      memberId,
    );
  }

  @ApiParam({
    name: 'roomid',
    description: '삭제하려는 방 코드',
  })
  @ApiResponse({
    description: '친구방 삭제 생성 성공',
    status: 200,
    schema: {
      example: {
        result: 'success',
      },
    },
  })
  @ApiResponse({
    description: '친구방 삭제 생성 실패 (roomid 오류)',
    status: 404,
    schema: {
      example: {
        result: 'fail',
      },
    },
  })
  @ApiOperation({ summary: '친구방 삭제하기' })
  @Delete(':roomid')
  async removeFriendsRoomChats(@Param('roomid') roomid: string) {
    return await this.friendsService.removeFriendsRoom(roomid);
  }
}
