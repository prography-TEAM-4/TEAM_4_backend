import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MultiModule } from './multi/multi.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { RandomModule } from './random/random.module';
import { FriendsModule } from './friends/friends.module';
import * as ormconfig from '../ormconfig';
@Module({
  imports: [
    MultiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TypeOrmModule.forRoot(ormconfig),
    OauthModule,
    RandomModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
