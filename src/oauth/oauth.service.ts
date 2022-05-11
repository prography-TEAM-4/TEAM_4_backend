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
      const ourAccessToken = jwt.sign(
        {
          id: data.id,
          provider: 'google',
          iss: 'pomo',
          sub: 'pomo jwt',
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        this.config.get('secret'),
      );
      return { accessToken: ourAccessToken };
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
  }

  async check(token: any) {
    try {
      await jwt.verify(token, this.config.get('secret'));
    } catch (error) {
      throw new UnauthorizedException(`unauthorized error`);
    }
    return {
      result: true,
    };
  }
}
