import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
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
import { generateImageCode } from 'src/commom/utility/generateImageCode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(BookList)
    private booklistRepository: Repository<BookList>,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
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
    console.log('random');
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

  async getRandomImage(userList: number[]) {
    const randomCode: string = generateImageCode(userList);
    // console.log(randomCode);
    // try {
    //   await this.fetchCachingData(randomCode);
    //   return {
    //     link: `https://d2x93sz3rudpa1.cloudfront.net/character/custom/${randomCode}.png`,
    //   };
    // } catch (error) {
    //   throw new NotFoundException('not exist image');
    // }
    return {
      link: `https://d2x93sz3rudpa1.cloudfront.net/character/custom/${randomCode}.png`,
    };
  }

  private async fetchCachingData(imgCode: string) {
    return this.httpService.axiosRef.get(
      `https://d2x93sz3rudpa1.cloudfront.net/character/custom/${imgCode}.png`,
    );
  }
}
