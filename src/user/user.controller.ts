import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateBookDto, ResponseBookDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Users')
@ApiBearerAuth('jwt')
@ApiHeader({ name: 'Authorization name undefined', description: 'JWT Bearer' })
@ApiResponse({
  status: 401,
  description: 'unathorized',
  schema: {
    example: {
      result: false,
      message: 'unauthorized',
    },
  },
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '로그인 되어 있는 유저에 도감을 등록한다',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: {
      example: {
        result: true,
      },
    },
  })
  @Post('book')
  create(
    @Body() createUserDto: CreateBookDto,
    @Headers('Authorization') token: any,
  ) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '로그인 되어 있는 유저에 대한 모든 도감 데이터를 가져온다',
  })
  @ApiResponse({
    status: 200,
    description:
      'result는 요청의 성공 여부를 담고 있다\t\ncount는 총 도감 수를 담는다\t\nbookList는 도감각각의 코드를 담는다',
    schema: {
      description:
        'result는 요청의 성공 여부를 담고 있다\t\ncount는 총 도감 수를 담는다\t\nbookList는 도감각각의 코드를 담는다',
      example: {
        result: true,
        count: 1,
        bookList: [
          {
            eye: 3,
            mouth: 3,
            arm: 3,
            body: 3,
            horn: 3,
            ear: 3,
            leg: 3,
            tail: 3,
          },
        ],
      },
    },
  })
  @Get('book')
  findAll() {
    return this.userService.findAll();
  }
  @Get('test')
  findTest() {
    return this.userService.test();
  }
}
