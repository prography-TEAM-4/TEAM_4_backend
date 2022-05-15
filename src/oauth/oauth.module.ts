import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [OauthModule],
})
export class OauthModule {}
