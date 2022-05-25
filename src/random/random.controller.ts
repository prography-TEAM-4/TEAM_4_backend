import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RandomService } from './random.service';

@ApiTags('Multi - Random')
@Controller('mode/random')
export class RandomController {
    constructor(private randomService: RandomService){}

    // @Get()
    // getRandomRoomList(){

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
        description: '로그인 유저: 랜덤방 만들기 성공',
        status: 200,
        schema: {
            example: {
                result: 'create success',
                room: [{
                    id: 'id', 
                    roomid: 'b7817821-dc63-4f09-97cc-32d466701077', 
                    host: 'user@example.com', 
                    headCount: '0', 
                    status: 'RANDOM', 
                }],
            },
        },
    })
    @ApiResponse({
        description: '비로그인 유저: 랜덤방 만들기 성공',
        status: 200,
        schema: {
            example: {
                result: 'create success',
                room: [{
                    id: 'id', 
                    roomid: 'b7817821-dc63-4f09-97cc-32d466701077', 
                    host: 'member1', 
                    headCount: '0', 
                    status: 'RANDOM', 
                }],
            },
        },
    })
    @ApiResponse({
        description: '매칭 성공',
        status: 200,
        schema: {
            example: {
                result: 'matching success',
                room: [{
                    id: 'id', 
                    roomid: 'b7817821-dc63-4f09-97cc-32d466701077', 
                    host: 'member1', 
                    headCount: '5', 
                    status: 'RANDOM', 
                }],
            },
        },
    })
    @ApiOperation({ summary: '랜덤매칭' })
    @Post('')
    async createOrMatch(
        @Headers('Authorization') token: any,
        @Body('nick') nick: string,
    ){
        return this.randomService.createOrMatch(token, nick);
    }
}
