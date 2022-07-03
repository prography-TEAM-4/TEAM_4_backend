import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { AccessToken, GoogleData } from './dto/oauth.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async googleAccess(accessToken: string) {
    let data: GoogleData | undefined;
    try {
      const tempData = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
      );
      data = tempData.data;
    } catch (error) {
      throw new UnauthorizedException('unauthorized error');
    }
    try {
      const alreadyExist = await this.userRepository
        .createQueryBuilder('User')
        .where('User.provider = :provider and SnsId = :SnsId', {
          provider: 'google',
          SnsId: data.id,
        })
        .execute();
      console.log(alreadyExist);
      if (!alreadyExist.length) {
        const newUser = new User();
        newUser.Nick = 'testing';
        (newUser.Provider = 'google'), (newUser.SnsId = data.id);
        await newUser.save();
      }
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
    const ourAccessToken = jwt.sign(
      {
        id: data.id,
        provider: 'google',
        iss: 'pomo',
        sub: 'pomo jwt',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      this.config.get('SECRET'),
    );
    return res
      .status(302)
      .redirect(
        `${this.config.get(
          'GOOGLE_CALLBACK',
        )}?accessToken=${ourAccessToken}&email=${data.email}&picture=${
          data.picture
        }`,
      );
  }

  async check(token: any) {
    try {
      await jwt.verify(token, this.config.get('SECRET'));
    } catch (error) {
      throw new UnauthorizedException(`unauthorized error`);
    }
    return {
      result: true,
    };
  }

  async naverLogin(code: string, res: Response) {
    const getTokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${this.config.get(
      'NAVER_CLIENTID',
    )}&client_secret=${this.config.get(
      'NAVER_SECRET',
    )}&code=${code}&state=asdf`;

    let authorization_code: any, result: any;

    try {
      authorization_code = await axios.get(getTokenUrl);
      result = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${authorization_code.data.access_token}`,
        },
      });
    } catch (e) {
      throw new UnauthorizedException(`unauthorized error`);
    }

    try {
      const alreadyExist = await this.userRepository
        .createQueryBuilder('User')
        .where('User.provider = :provider and SnsId = :SnsId', {
          provider: 'naver',
          SnsId: result.data.response.id,
        })
        .execute();
      if (!alreadyExist.length) {
        const newUser = new User();
        newUser.Nick = 'testing';
        (newUser.Provider = 'naver'), (newUser.SnsId = result.data.response.id);
        await newUser.save();
      }
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
    const ourAccessToken = jwt.sign(
      {
        id: result.data.response.id,
        provider: 'naver',
        iss: 'pomo',
        sub: 'pomo jwt',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      this.config.get('SECRET'),
    );
    return res
      .status(302)
      .redirect(
        `${this.config.get('NAVER_CALLBACK')}?accessToken=${ourAccessToken}`,
      );
  }
  async kakaoLogin(kakaoCode: string, res: Response) {
    let userData: any;
    const getTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.config.get(
      'KAKAO_CLIENTID',
    )}&redirect_uri=${this.config.get(
      'KAKAO_REDIRECT',
    )}&code=${kakaoCode}&client_secret=${this.config.get('KAKAO_SECRET')}`;
    let token: any;
    try {
      token = await axios.post(getTokenUrl);

      const access_token = token.data.access_token;
      const result = await axios.get(
        'https://kapi.kakao.com/v1/user/access_token_info',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      userData = result.data;
    } catch (e) {
      throw new UnauthorizedException(`unauthorized error`);
    }

    try {
      const alreadyExist = await this.userRepository
        .createQueryBuilder('User')
        .where('User.provider = :provider and SnsId = :SnsId', {
          provider: 'kakao',
          SnsId: userData.id,
        })
        .execute();
      if (!alreadyExist.length) {
        const newUser = new User();
        newUser.Nick = 'testing';
        (newUser.Provider = 'kakao'), (newUser.SnsId = userData.id);
        await newUser.save();
      }
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
    const ourAccessToken = jwt.sign(
      {
        id: userData.id,
        provider: 'kakao',
        iss: 'pomo',
        sub: 'pomo jwt',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      this.config.get('SECRET'),
    );
    return res
      .status(302)
      .redirect(
        `${this.config.get('KAKAO_CALLBACK')}?accessToken=${ourAccessToken}`,
      );
  }
}
