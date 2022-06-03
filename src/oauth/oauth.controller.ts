import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessToken } from './dto/oauth.dto';
import { OauthService } from './oauth.service';

@ApiTags('Oauth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @ApiResponse({
    description: 'unauthorized error',
    status: 401,
    schema: {
      example: { success: false, code: 401, data: 'unauthorized error' },
    },
  })
  @ApiResponse({
    description: 'unknown error',
    status: 404,
    schema: {
      example: { success: false, code: 404, data: 'unknown error' },
    },
  })
  @ApiResponse({
    description: '로그인 성공, 우리 access token 발급 7일간 유효',
    status: 200,
    schema: {
      example: { accessToken: 'asdfasdfasdf' },
    },
  })
  @ApiOperation({
    summary:
      '구글의 access token을 받아서 서버용 토큰을 발급(리프레쉬 토큰은 보안상 추천하지 않음) ',
  })
  @Post('/google')
  async googleCheck(@Body() accessToken: AccessToken) {
    return await this.oauthService.googleAccess(accessToken);
  }

  @ApiOperation({
    summary:
      '구글 로그인 페이지로 이동합니다 redirect_uri:"localhost:3030/oauth/google/callback"',
  })
  @Redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=258579638345-dadc5ipj9o3n64cnaqn3h2knm1ugtl76.apps.googleusercontent.com&response_type=token&redirect_uri=http://localhost:3030/oauth/google/callback&scope=https://www.googleapis.com/auth/userinfo.email`,
  )
  @Get('/google')
  googleLogin() {}

  @ApiOperation({ summary: '로그인이 되어있는지 확인하는 기능' })
  @ApiResponse({
    description: 'success',
    status: 200,
    schema: {
      example: {
        result: true,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
    schema: {
      example: {
        success: false,
        code: 401,
        data: 'unauthorized error',
      },
    },
  })
  @Get('check')
  async check(@Headers('Authorization') token: any) {
    return this.oauthService.check(token);
  }

  @ApiOperation({
    summary: 'naver login 페이지로 이동',
  })
  @Redirect(
    `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=t4SED16n0Lr9DdTRtV3F&redirect_uri=http://localhost:4000/oauth/naver/callback&state=abcdef`,
  )
  @Get('/naver')
  naverRedirect() {}

  @Get('naver/callback')
  async naverLogin(@Query('code') code: string) {
    return await this.oauthService.naverLogin(code);
  }
}
