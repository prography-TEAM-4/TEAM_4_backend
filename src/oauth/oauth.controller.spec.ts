import { Test, TestingModule } from '@nestjs/testing';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

class MockOauthService {}
describe('OauthController', () => {
  let controller: OauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthController],
      providers: [
        {
          provide: OauthService,
          useClass: MockOauthService,
        },
      ],
    }).compile();

    controller = module.get<OauthController>(OauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
