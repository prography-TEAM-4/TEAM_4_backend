import { Body, Controller, Get, Post, Headers, Param } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RandomService } from './random.service';

@ApiTags('Multi - Random')
@Controller('mode/random')
export class RandomController {
  constructor(private randomService: RandomService) {}

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
        data: 'Duplicate Nickname',
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
  async createOrMatchRoom() {
    return this.randomService.createOrMatch();
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
  @ApiOperation({ summary: '랜덤방 입장하기' })
  @Post(':roomid')
  async getRandomRoom(
    @Param('roomid') roomid: string,
    @Headers('Authorization') token: any,
    @Body('nick') nick: string,
    @Body('imgCode') imgCode: string,
  ) {
    return this.randomService.enterRoom(roomid, token, nick, imgCode);
  }
}
