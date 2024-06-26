import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { testDatabaseModule } from '@core/database/testDatabase';
import { seed } from '@core/database/seedData';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from '@modules/auth/auth.module';

import _ from 'lodash';
import { UserModule } from '@modules/user/user.module';
import { CreateUserDtoFactory } from '@modules/user/tests/factories';
import { UserRepository } from '@modules/user/user.repository';
import { EmailModule } from '@modules/email/email.module';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { AuthService, TOKEN_TYPE } from '../auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule, UserModule, AuthModule, EmailModule],
      controllers: [AppController],
      providers: [AppService, UserRepository],
    }).compile();
    await seed();
    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    authService = moduleFixture.get<AuthService>(AuthService);
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });
  const signupUser = async (createUserDto: CreateUserDto) => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(function (res) {
        if (res.status != 201) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.CREATED);
    return response;
  };
  const loginUser = async (email: string, password: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: email,
        password: password,
      })
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.OK);
    return response;
  };
  const refreshToken = async (token: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        token: token,
      })
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.OK);
    return response;
  };
  const resetPassword = async (token: string, password: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/reset/password')
      .send({
        token: token,
        password: password,
      })
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.OK);
    return response;
  };
  const resetPasswordEmail = async (email: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/reset/password/email')
      .send({
        email,
      })
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.OK);
    return response;
  };
  it('/auth/signup (POST)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const response = await signupUser(createUserDto);
    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
  });

  it('/reset/password/email (POST)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const response = await signupUser(createUserDto);
    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
    //confirm email
    await userRepository.update(response.body.id, { isActive: true });
    await resetPasswordEmail(response.body.email);
  });

  it('/auth/login (POST)', async () => {
    await loginUser('user@example.com', 'Passw0rd');
    return;
  });

  it('/auth/refresh (POST)', async () => {
    const { body: credentials } = await loginUser(
      'user@example.com',
      'Passw0rd',
    );

    const { body: refreshCredentials } = await refreshToken(
      credentials.refresh_token.token,
    );
    expect(refreshCredentials).toMatchObject({
      token: expect.any(String),
    });
    return;
  });

  it('/reset/password (POST)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const response = await signupUser(createUserDto);
    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
    //confirm email
    await userRepository.update(response.body.id, { isActive: true });
    const token = await authService.createToken(
      response.body,
      TOKEN_TYPE.RESET,
    );
    const { body: user } = await resetPassword(token.token, 'newPassssssss');
    expect(user).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
