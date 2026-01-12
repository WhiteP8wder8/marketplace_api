import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HashingService, useValue: mockHashingService },
      ],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call hash', async () => {
    await service.hash('data');
    expect(mockHashingService.hash).toHaveBeenCalledWith('data');
  });

  it('should call compare', async () => {
    await service.compare('data', 'encrypted');
    expect(mockHashingService.compare).toHaveBeenCalledWith('data', 'encrypted');
  });
});
