import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from 'src/entities/Room';
import { FriendsService } from './friends.service';

class MockRoomRepository {}
describe('FriendsService', () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: getRepositoryToken(Room),
          useClass: MockRoomRepository,
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
