import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFriendsRoomDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@domain.com',
    description: 'e-mail',
  })
  host: string;
}
