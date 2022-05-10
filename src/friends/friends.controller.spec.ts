import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { FriendsController } from './friends.controller';

class MockRoomRepository {}
describe('FriendsController', () => {
  let controller: FriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {
          provide: getRepositoryToken(Room),
          useClass: MockRoomRepository,
        },
      ],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
