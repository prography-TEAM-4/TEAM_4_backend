import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtParsed } from 'src/user/dto/userdata.dto';

export const parseJWT = (token: string, secret: string): jwtParsed => {
  try {
    const userData = jwt.verify(token, secret);
    return userData;
  } catch (error) {
    throw new UnauthorizedException(`unauthorized error`);
  }
};
