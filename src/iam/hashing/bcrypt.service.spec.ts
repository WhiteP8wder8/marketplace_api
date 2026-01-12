import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash data and verify with compare', async () => {
    const data = 'myPassword';
    const hashed = await service.hash(data);

    expect(hashed).not.toBe(data);
    const result = await service.compare(data, hashed);
    expect(result).toBe(true);
  });

  it('should fail compare for wrong data', async () => {
    const data = 'myPassword';
    const hashed = await service.hash(data);

    const result = await service.compare('wrongPassword', hashed);
    expect(result).toBe(false);
  });
});
