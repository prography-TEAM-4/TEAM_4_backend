import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MultiModule } from './multi/multi.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthController } from './oauth/oauth.controller';
import { OauthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { ModeModule } from './mode/mode.module';
import { RandomModule } from './random/random.module';
import { FriendsModule } from './friends/friends.module';
import { TestingController } from './testing/testing.controller';
import { TestingService } from './testing/testing.service';
import * as ormconfig from '../ormconfig';
@Module({
  imports: [
    MultiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TypeOrmModule.forRoot(ormconfig),
    OauthModule,
    ModeModule,
    RandomModule,
    FriendsModule,
  ],
  controllers: [AppController, TestingController],
  providers: [AppService, TestingService],
})
export class AppModule {}
