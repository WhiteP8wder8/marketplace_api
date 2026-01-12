import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {REQUEST_USER_KEY} from "../iam/constants/iam.constants";

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      getMe: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, name: 'Test' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getMe should return user', async () => {
    const req: any = { [REQUEST_USER_KEY]: { sub: 1 } };
    const user = await controller.getMe(req);
    expect(user).toEqual({ id: 1, name: 'Test' });
    expect(usersService.getMe).toHaveBeenCalledWith(1);
  });
});
