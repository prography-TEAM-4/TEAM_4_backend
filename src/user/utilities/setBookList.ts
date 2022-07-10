import { BookList } from 'src/entities/BookList';
import { CreateBookDto } from '../dto/create-user.dto';

export const setBookList = (
  newBook: BookList,
  createUserDto: CreateBookDto,
  existUser,
) => {
  newBook.arm = createUserDto.arm;
  newBook.body = createUserDto.body;
  newBook.ear = createUserDto.ear;
  newBook.face = createUserDto.face;
  newBook.leg = createUserDto.leg;
  newBook.tail = createUserDto.tail;
  newBook.user = existUser;
  return newBook;
};
