import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

import { jwtParsed } from 'src/user/dto/userdata.dto';

export const parseJWT = (token: string, secret: string): jwtParsed => {
  if (!token.startsWith('Bearer ')) {
    throw new NotFoundException('unknown error');
  }
  const parsedToken = token.replace(/^(Bearer )/, '');
  try {
    // verify를 통해 값 decode!
    const decoded: jwtParsed = verify(parsedToken, secret) as jwtParsed;
    return decoded;
  } catch (error) {
    throw new UnauthorizedException(`unauthorized error`);
  }
};
