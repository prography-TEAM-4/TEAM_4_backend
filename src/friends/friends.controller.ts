import { Controller, Get } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
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
  @Get('')
  async createFriendsRoom() {
    return await this.friendsService.createFriendsRoom();
  }
}
