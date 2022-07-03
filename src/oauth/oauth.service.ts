import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { GoogleData } from './utilities/oauth.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { jwtParsed } from 'src/user/dto/userdata.dto';
import { parseJWT } from 'src/commom/utility/parseJWT';
import { generateToken } from './utilities/generateToken';
import {
  findOrCreate,
  getGoogleData,
  getKakaoData,
  getNaverData,
  TFindOrCreate,
} from './utilities/oauthApi';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async googleAccess(accessToken: string) {
    const data: GoogleData = await getGoogleData(accessToken);

    const userData: TFindOrCreate = {
      SnsId: data.id,
      email: data.email,
      picture: data.picture,
      Nick: 'testing',
      Provider: 'google',
    };

    await findOrCreate(userData, this.userRepository);

    const ourAccessToken = generateToken(
      data.id,
      'google',
      this.config.get('SECRET'),
    );

    return {
      accessToken: ourAccessToken,
      email: data.email,
      picture: data.picture,
    };
  }

  async check(token: any) {
    parseJWT(token, this.config.get('SECRET'));
    return {
      result: true,
    };
  }

  async naverLogin(code: string, res: Response) {
    const data = await getNaverData(code, this.config);
    const userData: TFindOrCreate = {
      SnsId: data.id,
      email: data.email,
      picture: '',
      Nick: 'testing',
      Provider: 'naver',
    };
    await findOrCreate(userData, this.userRepository);

    generateToken(data.id, 'naver', this.config.get('SECRET'));
    const ourAccessToken = generateToken(
      data.id,
      'naver',
      this.config.get('SECRET'),
    );
    return res
      .status(302)
      .redirect(
        `${this.config.get(
          'NAVER_CALLBACK',
        )}?accessToken=${ourAccessToken}&email=${data.email}`,
      );
  }

  refreshToken(token: string) {
    const decoded: jwtParsed = parseJWT(token, this.config.get('SECRET'));

    return {
      accessToken: generateToken(
        decoded.id,
        decoded.provider,
        this.config.get('SECRET'),
      ),
    };
  }

  async kakaoLogin(kakaoCode: string, res: Response) {
    const data = await getKakaoData(kakaoCode, this.config);
    const userData: TFindOrCreate = {
      Nick: 'testing',
      picture: '',
      email: '',
      Provider: 'kakao',
      SnsId: data.id,
    };

    await findOrCreate(userData, this.userRepository);

    const ourAccessToken = generateToken(
      data.id,
      'kakao',
      this.config.get('SECRET'),
    );
    return res
      .status(302)
      .redirect(
        `${this.config.get('KAKAO_CALLBACK')}?accessToken=${ourAccessToken}`,
      );
  }
}
