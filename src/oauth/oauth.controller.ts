import { Controller, Get, Headers, Query, Redirect, Res } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OauthService } from './oauth.service';
import { config } from 'dotenv';
import { Response } from 'express';
config();

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
    status: 200,
    description: '성공',
    schema: {
      example: {
        accessToken: 'ourAccessToken',
        email: 'email',
        picture: 'picture url',
      },
    },
  })
  @Get('/google/callback')
  async googleCheck(@Query('code') code: string) {
    return await this.oauthService.googleAccess(code);
  }

  //todo : req 를 받아서, req가 로컬호스트인지, 아닌지를 보고 redirect url 을 처리하는 방법
  @ApiOperation({
    summary: `구글 로그인 페이지로 이동합니다 redirect_uri:${process.env.GOOGLE_REDIRECT}`,
  })
  @Redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENTID}&response_type=token&redirect_uri=${process.env.GOOGLE_REDIRECT}&scope=https://www.googleapis.com/auth/userinfo.email`,
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
    summary: `네이버 로그인 페이지 https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENTID}&redirect_uri=${process.env.NAVER_REDIRECT}&state=abcdef`,
  })
  @Redirect(
    `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENTID}&redirect_uri=${process.env.NAVER_REDIRECT}&state=abcdef`,
  )
  @Get('/naver')
  naverRedirect() {}

  @ApiOperation({
    summary: `로그인 성공시 ${process.env.NAVER_CALLBACK}?accessToken=토큰값 으로 redirect`,
  })
  @Get('naver/callback')
  async naverLogin(@Query('code') code: string, @Res() res: Response) {
    return await this.oauthService.naverLogin(code, res);
  }

  @Get('/test')
  test() {
    return 'asdf';
  }

  @Redirect(
    `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENTID}&redirect_uri=${process.env.KAKAO_REDIRECT}&response_type=code`,
  )
  @ApiOperation({
    summary: `카카오 로그인 페이지 https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENTID}&redirect_uri=${process.env.KAKAO_REDIRECT}&response_type=code`,
  })
  @Get('/kakao')
  kakaoPage() {}

  @ApiOperation({
    summary: `로그인 성공시 ${process.env.KAKAO_CALLBACK}?accessToken=토큰값 으로 redirect`,
  })
  @Get('/kakao/callback')
  async kakaoLogin(@Query('code') kakaoCode: any, @Res() res: Response) {
    return await this.oauthService.kakaoLogin(kakaoCode, res);
  }

  @ApiHeader({
    name: 'Bearer Authorization',
    description: 'eyJhGcioJ와 같은 accessToken',
  })
  @ApiResponse({
    description: 'unknown error',
    status: 404,
    schema: {
      example: { success: false, code: 404, data: 'unknown error' },
    },
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: {
      example: {
        accessToken: 'ourAccessToken',
      },
    },
  })
  @ApiOperation({
    summary: '토큰 연장',
  })
  @Get('/refresh')
  refreshToken(@Headers('Authorization') token: string) {
    return this.oauthService.refreshToken(token);
  }
}
