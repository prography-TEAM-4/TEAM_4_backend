import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessToken } from './dto/oauth.dto';
import { OauthService } from './oauth.service';

@ApiTags('Oauth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}
  @ApiOperation({
    summary:
      '구글의 access token을 받아서 서버용 토큰을 발급(리프레쉬 토큰은 보안상 추천하지 않음) ',
  })
  @Post('/google')
  async googleCheck(@Body() accessToken: AccessToken) {
    await this.oauthService.googleAccess(accessToken);
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
}
