import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
  @ApiProperty({
    example: 'asdfasdftokenasdf',
    description: 'google access Token',
  })
  accessToken: string;
}
export class GoogleData {
  id: 'string';
  email: 'string';
  verified_email: boolean;
  picture: 'string';
}
