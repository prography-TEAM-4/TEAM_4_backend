import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-user.dto';
import { UpdateBookDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly config: ConfigService,
  ) {}
  create(createUserDto: CreateBookDto) {
    const user = new Users();
    user.Email = 'asdf';
    user.SnsId = 'zxcv';
    this.usersRepository.save(user);
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
