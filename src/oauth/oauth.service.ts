import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { AccessToken, GoogleData } from './dto/oauth.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async googleAccess({ accessToken }: AccessToken) {
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
      if (!alreadyExist.length) {
        const newUser = new User();
        newUser.Nick = 'testing';
        (newUser.Provider = 'google'), (newUser.SnsId = data.id);
        await newUser.save();
      }
      console.log('db save success');
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
    return { accessToken: ourAccessToken };
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

  async naverLogin(code: string) {
    const getTokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=t4SED16n0Lr9DdTRtV3F&client_secret=${this.config.get(
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
      console.log('db save success');
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
    return { accessToken: ourAccessToken };

    // data.refresh_token,
  }
}
