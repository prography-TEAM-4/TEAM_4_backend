import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
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
    name: 'Bearer Authorization',
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
        data: 'Duplicate Nickname',
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
    name: 'Bearer Authorization',
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
        data: 'Not Exist Room',
      },
    },
  })
  @ApiResponse({
    description: 'Duplicate Nickname',
    status: 400,
    schema: {
      example: {
        success: false,
        code: 400,
        data: 'Duplicate Nickname',
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
          },
        ],
        room: [
          {
            id: '1',
            roomid: 'a199ead7-4dfc-429a-a62c-84b6039854ac',
            host: 'host',
            headCount: '3',
            status: 'FRIENDS',
          },
        ],
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

  @ApiHeader({
    name: 'Bearer Authorization',
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
        memberId: 'example',
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
    @Body('memberId') nick: string,
  ) {
    return await this.friendsService.creatFriendsRoomChats(
      token,
      roomid,
      content,
      nick,
    );
  }
}
