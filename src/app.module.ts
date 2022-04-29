import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { MultiModule } from './multi/multi.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthController } from './oauth/oauth.controller';
import { OauthModule } from './oauth/oauth.module';
@Module({
  imports: [
    RoomsModule,
    MultiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'Mypresentsong1',
    //   database: 'PrographyDB',
    //   entities: [],
    //   synchronize: true,
    // }),
    OauthModule,
  ],
  controllers: [AppController, OauthController],
  providers: [AppService],
})
export class AppModule {}
