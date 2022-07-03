import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

export const getGoogleData = async (accessToken: string) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
    );
    return data;
  } catch (error) {
    throw new UnauthorizedException('unauthorized error');
  }
};
export type TFindOrCreate = {
  Nick: string;
  picture: string;
  email: string;
  Provider: string;
  SnsId: string;
};
export const findOrCreate = async (
  userData: TFindOrCreate,
  userRepository: Repository<User>,
) => {
  try {
    const alreadyExist = await userRepository
      .createQueryBuilder('User')
      .where('User.provider = :provider and SnsId = :SnsId', {
        provider: 'google',
        SnsId: userData.SnsId,
      })
      .execute();
    if (!alreadyExist.length) {
      const newUser = new User();
      newUser.Nick = userData.Nick;
      newUser.picture = userData.picture;
      newUser.email = userData.email;
      newUser.Provider = userData.Provider;
      newUser.SnsId = userData.SnsId;
      await newUser.save();
    }
  } catch (error) {
    throw new NotFoundException('unknown error');
  }
};

export const getKakaoData = async (
  code: string,
  config: ConfigService<Record<string, unknown>, false>,
) => {
  const getTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${config.get(
    'KAKAO_CLIENTID',
  )}&redirect_uri=${config.get(
    'KAKAO_REDIRECT',
  )}&code=${code}&client_secret=${config.get('KAKAO_SECRET')}`;
  try {
    const { data } = await axios.post(getTokenUrl);

    const access_token = data.access_token;
    const result = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return result.data;
  } catch (e) {
    throw new UnauthorizedException(`unauthorized error`);
  }
};

export const getNaverData = async (
  code: string,
  config: ConfigService<Record<string, unknown>, false>,
) => {
  const getTokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.get(
    'NAVER_CLIENTID',
  )}&client_secret=${config.get('NAVER_SECRET')}&code=${code}&state=asdf`;

  try {
    const { data } = await axios.get(getTokenUrl);
    const result = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    return result.data.response;
  } catch (e) {
    throw new UnauthorizedException(`unauthorized error`);
  }
};
