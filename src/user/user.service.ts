import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-user.dto';
import { UpdateBookDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}
  create(createUserDto: CreateBookDto, token: any) {
    // const user = new User();
    console.log(token);
    // user.SnsId = 'zxcv';
    // this.usersRepository.save(user);
    return 'This action adds a new user';
  }

  async findAll() {
    const userslist = await this.usersRepository.find();
    return userslist;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateBookDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  test() {
    return this.config.get('DB_USERNAME') || 'no secret is here';
  }
}
