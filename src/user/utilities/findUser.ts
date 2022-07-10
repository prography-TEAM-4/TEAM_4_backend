import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { jwtParsed } from '../dto/userdata.dto';

export const findUserById = async (
  usersRepository: Repository<User>,
  userData: jwtParsed,
) => {
  const existUser = await usersRepository.findOne({
    where: { SnsId: userData.id, Provider: userData.provider },
  });
  if (!existUser) {
    throw new UnauthorizedException(`unauthorized error`);
  }
  return existUser;
};
