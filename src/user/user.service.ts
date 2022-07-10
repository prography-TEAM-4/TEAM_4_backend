import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { jwtParsed } from './dto/userdata.dto';
import { BookList } from 'src/entities/BookList';
import { parseJWT } from 'src/commom/utility/parseJWT';
import { randomData } from './utilities/randomData';
import { setBookList } from './utilities/setBookList';
import { findUserById } from './utilities/findUser';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(BookList)
    private booklistRepository: Repository<BookList>,
    private readonly config: ConfigService,
  ) {}
  async create(createUserDto: CreateBookDto, token: any) {
    const userData: jwtParsed = parseJWT(token, this.config.get('SECRET'));

    const existUser = await findUserById(this.usersRepository, userData);

    try {
      const newBook: BookList = setBookList(
        new BookList(),
        createUserDto,
        existUser,
      );
      newBook.save();
    } catch (error) {
      throw new NotFoundException('db error');
    }

    return {
      result: true,
    };
  }

  async findAll(token: any) {
    const userData: jwtParsed = parseJWT(token, this.config.get('SECRET'));
    try {
      const user = await findUserById(this.usersRepository, userData);
      const result = await this.booklistRepository.findAndCount({
        where: { user: user },
      });
      return result;
    } catch (error) {
      throw new NotFoundException('db error');
    }
  }

  async findUser(token: any) {
    const userData: jwtParsed = parseJWT(token, this.config.get('SECRET'));

    try {
      const user = await findUserById(this.usersRepository, userData);
      const filteredUser = Object.keys(user)
        .filter((key) => key === 'Nick' || key === 'point')
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: user[key] });
        }, {});

      return filteredUser;
    } catch (error) {
      throw new NotFoundException('db error');
    }
  }

  test() {
    return this.config.get('DB_USERNAME') || 'no secret is here';
  }

  async randomNick() {
    return randomData();
  }

  async patchUser(token: any, body: string) {
    const userData: jwtParsed = parseJWT(token, this.config.get('SECRET'));

    try {
      const user = await findUserById(this.usersRepository, userData);
      user.Nick = body;
      await user.save();
      return {
        result: true,
        Nick: body,
      };
    } catch (error) {
      throw new NotFoundException('db error');
    }
  }
}
