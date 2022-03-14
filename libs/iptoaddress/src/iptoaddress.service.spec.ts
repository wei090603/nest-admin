import { Test, TestingModule } from '@nestjs/testing';
import { IptoaddressService } from './iptoaddress.service';

describe('IptoaddressService', () => {
  let service: IptoaddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IptoaddressService],
    }).compile();

    service = module.get<IptoaddressService>(IptoaddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
