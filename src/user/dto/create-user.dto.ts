import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 3,
    description: '눈 코드',
  })
  public eye: number;

  @ApiProperty({
    example: 3,
    description: '입 코드',
  })
  public mouth: number;

  @ApiProperty({
    example: 3,
    description: '팔 코드',
  })
  public arm: number;

  @ApiProperty({
    example: 3,
    description: '몸 코드',
  })
  public body: number;

  @ApiProperty({
    example: 3,
    description: '뿔 코드',
  })
  public horn: number;

  @ApiProperty({
    example: 3,
    description: '귀 코드',
  })
  public ear: number;

  @ApiProperty({
    example: 3,
    description: '다리 코드',
  })
  public leg: number;

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
    description: '도감의 데이터 배열',
  })
  bookList: CreateBookDto[];
}
