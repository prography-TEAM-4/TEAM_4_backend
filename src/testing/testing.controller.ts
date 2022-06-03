import { Controller, Get, Param, Query, Redirect } from '@nestjs/common';
import axios from 'axios';

@Controller('testing')
export class TestingController {
  @Get('/')
  test() {
    return 'testing';
  }

  @Redirect(
    'https://kauth.kakao.com/oauth/authorize?client_id=16cfce5f06f4686516fbc35d3be60660&redirect_uri=http://localhost:3000/testing/kakao/callback&response_type=code',
  )
  @Get('/kakao')
  kakaoPage() {}

  @Get('/kakao/callback')
  async kakaoLogin(@Query('code') qcode: any) {
    const kakaoCode = qcode.code;
    const result = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=16cfce5f06f4686516fbc35d3be60660&redirect_uri=http://localhost:3000/testing/kakao/callback&code=${qcode}&client_secret=${client_secret}`,
    );
    console.log(result.data);
    const access_token = result.data.access_token;
    const { data } = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log(data.id);
    //return data.id;
    //끝 이거 저장하면 됨
  }
}
