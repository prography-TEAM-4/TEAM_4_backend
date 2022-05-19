import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { jwtParsed } from './dto/userdata.dto';
import { BookList } from 'src/entities/BookList';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(BookList)
    private booklistRepository: Repository<BookList>,
    private readonly config: ConfigService,
  ) {}
  async create(createUserDto: CreateBookDto, token: any) {
    let userData: jwtParsed;
    try {
      userData = jwt.verify(token, this.config.get('secret'));
    } catch (error) {
      throw new UnauthorizedException(`unauthorized error`);
    }
    const existUserList = await this.usersRepository.find({
      where: { SnsId: userData.id, Provider: userData.provider },
    });
    console.log(existUserList);
    if (existUserList.length === 0) {
      throw new NotAcceptableException('user is not found');
    }
    const existUser = existUserList[0];
    const newBook: BookList = new BookList();
    newBook.arm = createUserDto.arm;
    newBook.body = createUserDto.body;
    newBook.ear = createUserDto.ear;
    newBook.eye = createUserDto.eye;
    newBook.horn = createUserDto.horn;
    newBook.leg = createUserDto.leg;
    newBook.tail = createUserDto.tail;
    newBook.pattern = createUserDto.pattern;
    newBook.walkingLeg1 = createUserDto.walkingLeg1;
    newBook.walkingLeg2 = createUserDto.walkingLeg2;
    newBook.user = existUser;
    try {
      newBook.save();
    } catch (error) {
      throw new RequestTimeoutException('db error');
    }
    return {
      result: true,
    };
  }

  async findAll(token: any) {
    let userData: jwtParsed;
    try {
      userData = jwt.verify(token, this.config.get('secret'));
    } catch (error) {
      throw new UnauthorizedException(`unauthorized error`);
    }
    try {
      const user = await this.usersRepository.findOne({
        where: { SnsId: userData.id, Provider: userData.provider },
      });
      if (!user) {
        throw new UnauthorizedException(`unauthorized error`);
      }
      const result = await this.booklistRepository.findAndCount({
        where: { user: user },
      });
      console.log(result);
      return result;
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
  }

  async findUser(token: any) {
    let userData: jwtParsed;
    try {
      userData = await jwt.verify(token, this.config.get('secret'));
    } catch (error) {
      throw new UnauthorizedException(`unauthorized error`);
    }

    try {
      const user = await this.usersRepository.findOne({
        where: { SnsId: userData.id, Provider: userData.provider },
      });
      if (!user) {
        throw new UnauthorizedException(`unauthorized error`);
      }
      const filteredUser = Object.keys(user)
        .filter((key) => key === 'Nick' || key === 'point')
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: user[key] });
        }, {});

      return filteredUser;
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
  }

  test() {
    return this.config.get('DB_USERNAME') || 'no secret is here';
  }

  async randomNick() {
    const rand = Math.floor(Math.random() * 100);
    const code = {
      eye: Math.floor(Math.random() * 3),
      mouth: Math.floor(Math.random() * 3),
      arm: Math.floor(Math.random() * 3),
      body: Math.floor(Math.random() * 3),
      horn: Math.floor(Math.random() * 3),
      ear: Math.floor(Math.random() * 3),
      leg: Math.floor(Math.random() * 3),
      tail: Math.floor(Math.random() * 3),
      pattern: Math.floor(Math.random() * 3),
      walkingLeg1: Math.floor(Math.random() * 3),
      walkingLeg2: Math.floor(Math.random() * 3),
    };
    return {
      Nick: '테스팅용 랜덤' + rand,
      code,
    };
  }

  async patchUser(token: any, body: string) {
    let userData: jwtParsed;
    try {
      userData = await jwt.verify(token, this.config.get('secret'));
    } catch (error) {
      throw new UnauthorizedException(`unauthorized error`);
    }
    try {
      const user = await this.usersRepository.findOne({
        where: { SnsId: userData.id, Provider: userData.provider },
      });
      if (!user) {
        throw new UnauthorizedException(`unauthorized error`);
      }
      user.Nick = body;
      await user.save();
      return {
        result: true,
        Nick: body,
      };
    } catch (error) {
      throw new NotFoundException('unknown error');
    }
  }
}
