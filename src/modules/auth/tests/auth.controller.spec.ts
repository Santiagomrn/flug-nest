import { Test, TestingModule } from '@nestjs/testing';

import { testDatabaseModule } from '@core/database/testDatabase';
import { JwtService } from '@nestjs/jwt';
import { IsRoleGuard } from '@modules/auth/guards/isRole.guard';
import { IsSelfUserGuard } from '@modules/auth/guards/isSelfUser.guard';
import { AuthService, Token } from '../auth.service';
import { AuthController } from '../auth.controller';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { User } from '@modules/user/entities/user.entity';
import {
  CreateUserDtoFactory,
  FederatedUserDtoFactory,
  UserFactory,
} from '@modules/user/tests/factories';
import { Plain } from '@libraries/BaseModel';
import { Role } from '@modules/role/entities/role.entity';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';

describe('Auth Controller', () => {
  let controller: AuthController, service: AuthService;
  const credentials = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiYWNjZXNzIiwiYXVkIjoidXNlciIsImV4cCI6MTcxMjgwNzI5My45MDMsImlhdCI6MTcxMDIxNTI5My45MDMsImp0aSI6ImJjNWI2MzJhLTVhZmItNDg1Mi1iNzA4LTQ2ZTdjYTZkZjEzMyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJhZG1pbiIsImRlc2NyaXB0aW9uIjoiYWRtaW4iLCJpc0RlZmF1bHQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDI0LTAzLTA4VDAzOjA3OjM3LjY3M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTAzLTA4VDAzOjA3OjM3LjY3M1oiLCJVc2VyUm9sZSI6eyJpZCI6MSwidXNlcklkIjoxLCJyb2xlSWQiOjEsImNyZWF0ZWRBdCI6IjIwMjQtMDMtMDhUMDM6MDc6MzcuODAxWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDMtMDhUMDM6MDc6MzcuODAxWiJ9fV19.hiCdpoivLRCEniopoaWM4uKFkuDdxnvnC4SF5VKjN',
    expires: 1712807293.903,
    refresh_token: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoicmVmcmVzaCIsImF1ZCI6InVzZXIiLCJleHAiOjE3MjYxMTI4OTMuOTIsImlhdCI6MTcxMDIxNTI5My45MjEsImp0aSI6ImM3NTdmNmI0LTYwNWYtNGM2Ny05YjhjLTU2M2M4MmE1ZDVkMyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJhZG1pbiIsImRlc2NyaXB0aW9uIjoiYWRtaW4iLCJpc0RlZmF1bHQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDI0LTAzLTA4VDAzOjA3OjM3LjY3M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTAzLTA4VDAzOjA3OjM3LjY3M1oiLCJVc2VyUm9sZSI6eyJpZCI6MSwidXNlcklkIjoxLCJyb2xlSWQiOjEsImNyZWF0ZWRBdCI6IjIwMjQtMDMtMDhUMDM6MDc6MzcuODAxWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDMtMDhUMDM6MDc6MzcuODAxWiJ9fV19.rmnHyVSBezLJO5ZisReJqN9V0xamfq3yUtTbO4Dep',
      expires: 1726112893.92,
      expires_in: 15897599.999000072,
    },
    user: {
      id: 1,
      email: 'admin@example.com',
    },
    roles: [
      {
        id: 1,
        name: 'admin',
        description: 'admin',
        isDefault: false,
        createdAt: '2024-03-08T03:07:37.673Z',
        updatedAt: '2024-03-08T03:07:37.673Z',
        UserRole: {
          id: 1,
          userId: 1,
          roleId: 1,
          createdAt: '2024-03-08T03:07:37.801Z',
          updatedAt: '2024-03-08T03:07:37.801Z',
        },
      },
    ],
  } as unknown as {
    token: string;
    expires: number;
    refresh_token: Token;
    user: Partial<Plain<User>>;
    roles: Role[];
  };
  const createTestingModule = async () => {
    const mockAuthService = {
      signIn: async () => credentials,
      signUp: jest.fn(async (dto: CreateUserDto) => {
        return UserResponseDto.fromUser(
          User.build({
            id: Math.round(Math.random() * (1000 - 1) + 1),
            ...dto,
          }),
        );
      }),
      googleSingIn: async () => credentials,
      createToken: async () => {},
      createCredentials: async () => credentials,
      refreshToken: async () => credentials,
      validateJwt: async () => {},
      confirmEmail: async () => {},
      googleAuthRedirect: async () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule],
      controllers: [AuthController],
      providers: [AuthService, JwtService, IsRoleGuard, IsSelfUserGuard],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    return module;
  };

  beforeAll(async () => {
    const module = await createTestingModule();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should signIn', async () => {
    const mockedUser: User = UserFactory();
    jest.spyOn(service, 'signIn').mockResolvedValue(credentials);
    expect(
      await controller.signIn({
        email: mockedUser.email,
        password: mockedUser.password,
      }),
    ).toStrictEqual(credentials);
  });

  it('should signUp', async () => {
    const createUserDto: CreateUserDto = CreateUserDtoFactory();
    const mockedUserResponse = UserResponseDto.fromUser(
      User.build(createUserDto),
    );
    expect(await controller.signUp(createUserDto)).toMatchObject({
      ...mockedUserResponse,
      id: expect.any(Number),
    });
  });

  it('should refreshToken', async () => {
    jest.spyOn(service, 'refreshToken').mockResolvedValue(credentials);
    expect(
      await controller.refreshToken({
        token: credentials.refresh_token.token,
      }),
    ).toStrictEqual(credentials);
  });

  it('should confirmEmail', async () => {
    expect(await controller.confirmEmail(credentials.token)).toStrictEqual(
      undefined,
    );
  });

  it('should authGoogle be defined', async () => {
    expect(await controller.authGoogle).toBeDefined();
  });

  it('should Sigin', async () => {
    const federatedUserDto = FederatedUserDtoFactory();
    jest.spyOn(service, 'googleAuthRedirect').mockResolvedValue(credentials);
    expect(await controller.googleAuthRedirect(federatedUserDto)).toStrictEqual(
      credentials,
    );
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
