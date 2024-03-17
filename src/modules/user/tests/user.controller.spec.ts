import { Test, TestingModule } from '@nestjs/testing';

import { testDatabaseModule } from '@core/database/testDatabase';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import {
  CreateUserDtoFactory,
  UpdateUserDtoFactory,
  UserFactory,
} from './factories';
import { IsRoleGuard } from '@modules/auth/guards/isRole.guard';
import { IsSelfUserGuard } from '@modules/auth/guards/isSelfUser.guard';
import { UserResponseDto } from '../dto/user-response.dto';

describe('User Controller', () => {
  let controller: UserController, service: UserService;
  const createTestingModule = async () => {
    if (controller && service) return { controller, service };
    const mockUserService = {
      findOne: async () => {},
      findAll: async () => {},
      create: jest.fn(async (dto: CreateUserDto) => {
        return UserResponseDto.fromUser(
          User.build({
            id: Math.round(Math.random() * (1000 - 1) + 1),
            ...dto,
          }),
        );
      }),
      update: jest.fn(async (id: number, dto: UpdateUserDto) => {
        return UserResponseDto.fromUser(
          User.build({
            id: id,
            ...dto,
          }),
        );
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule, SequelizeModule.forFeature([User])],
      controllers: [UserController],
      providers: [UserService, JwtService, IsRoleGuard, IsSelfUserGuard],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    return { controller, service };
  };

  afterEach(() => {
    //clear all mocks useful when multiple scenarios should be replicated
    jest.clearAllMocks();
  });

  it('should return a user', async () => {
    const { controller, service } = await createTestingModule();
    const mockedUser: User = UserFactory();
    const mockedUserResponse = UserResponseDto.fromUser(mockedUser);
    jest.spyOn(service, 'findOne').mockImplementation(
      jest.fn(async (id) => {
        mockedUserResponse.id = id;
        return mockedUserResponse;
      }),
    );

    expect(await controller.findOne(mockedUser.id)).toStrictEqual(
      mockedUserResponse,
    );
  });

  it('should return an array of users', async () => {
    const { controller, service } = await createTestingModule();
    const mockedUsers = UserFactory(10);
    const mockedUsersResponse = UserResponseDto.fromUser(mockedUsers);
    jest.spyOn(service, 'findAll').mockImplementation(
      jest.fn(async () => {
        return { count: 10, limit: 10, offset: 0, data: mockedUsersResponse };
      }),
    );

    expect(await controller.findAll()).toStrictEqual({
      count: 10,
      limit: 10,
      offset: 0,
      data: mockedUsersResponse,
    });
  });

  it('should create a user', async () => {
    const { controller } = await createTestingModule();
    const createUserDto: CreateUserDto = CreateUserDtoFactory();
    const mockedUserResponse = UserResponseDto.fromUser(
      User.build(createUserDto),
    );
    expect(await controller.create(createUserDto)).toMatchObject({
      ...mockedUserResponse,
      id: expect.any(Number),
    });
  });

  it('should update a user', async () => {
    const { controller } = await createTestingModule();
    const updateUserDto: UpdateUserDto = UpdateUserDtoFactory();
    const id = 1;
    const mockedUserResponse = UserResponseDto.fromUser(
      User.build(updateUserDto),
    );
    expect(await controller.update(id, updateUserDto)).toMatchObject({
      ...mockedUserResponse,
      id,
    });
  });

  it('should be defined', async () => {
    const { controller } = await createTestingModule();
    expect(controller).toBeDefined();
  });
});
