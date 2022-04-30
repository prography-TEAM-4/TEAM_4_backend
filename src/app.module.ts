import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { MultiModule } from './multi/multi.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthController } from './oauth/oauth.controller';
import { OauthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import * as ormconfig from '../ormconfig';
@Module({
  imports: [
    RoomsModule,
    MultiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    // TypeOrmModule.forRoot(ormconfig),
    OauthModule,
  ],
  controllers: [AppController, OauthController],
  providers: [AppService],
})
export class AppModule {}
