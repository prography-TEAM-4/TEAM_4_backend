import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Room } from 'src/entities/Room';
import { Users } from './src/entities/Users';
dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, Room],
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: true, //첫 시작은 true, 나머지는 계속 false
  logging: true, //쿼리문 로그
  keepConnectionAlive: true, //핫 리로딩 시 연결 차단 막기
};

export = config;
