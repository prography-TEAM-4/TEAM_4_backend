import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-user.dto';
import { UpdateBookDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateBookDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
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
}
