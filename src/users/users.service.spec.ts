import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {HashingService} from "../iam/hashing/hashing.service";

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: any;
  let hashingServiceMock: any;

  beforeEach(async () => {
    userRepositoryMock = {
      find: jest.fn(),
      delete: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    hashingServiceMock = {
      hash: jest.fn().mockResolvedValue('hashedPassword'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: HashingService, useValue: hashingServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
