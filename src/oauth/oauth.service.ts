import { Injectable } from '@nestjs/common';
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
    try {
      const { data }: { data: GoogleData } = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
      );
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
        { id: data.id, provider: 'google' },
        this.config.get('secret'),
      );
      console.log(ourAccessToken);
      return { accessToken: ourAccessToken };
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  }
}
