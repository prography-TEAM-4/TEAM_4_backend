import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNumber()
  @ApiProperty({
    example: 3,
    description: '눈 코드',
  })
  public face: number;

  @IsNumber()
  @ApiProperty({
    example: 3,
    description: '팔 코드',
  })
  public arm: number;

  @IsNumber()
  @ApiProperty({
    example: 3,
    description: '몸 코드',
  })
  public body: number;

  @IsNumber()
  @ApiProperty({
    example: 3,
    description: '귀 코드',
  })
  public ear: number;

  @IsNumber()
  @ApiProperty({
    example: 3,
    description: '다리 코드',
  })
  public leg: number;

  @IsNumber()
  @ApiProperty({
    example: 3,
    description: '꼬리 코드',
  })
  public tail: number;
}
export class ResponseBookDto {
  @ApiProperty({
    example: true,
    description: 'api성공 여부',
  })
  result: boolean;

  @ApiProperty({
    example: 1,
    description: '도감의 총 수 여부',
  })
  count: number;

  @ApiProperty({
    example: [
      {
        face: 3,
        arm: 3,
        body: 3,
        ear: 3,
        leg: 3,
        tail: 3,
      },
    ],
    description:
      '도감의 데이터 배열 일단 다 있어야 되니까 없는 코드는 따로 생각해둬',
  })
  bookList: CreateBookDto[];
}
