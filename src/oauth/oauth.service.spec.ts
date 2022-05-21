import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { OauthService } from './oauth.service';

class MockUserRepository {}
describe('OauthService', () => {
  let service: OauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OauthService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<OauthService>(OauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
