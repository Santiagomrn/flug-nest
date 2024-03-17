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

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule, UserModule, AuthModule, EmailModule],
      controllers: [AppController],
      providers: [AppService, UserRepository],
    }).compile();
    await seed();
    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  it('/auth/signup (POST)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(function (res) {
        if (res.status != 201) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
  });

  it('/auth/login (POST)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const { body: user } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(function (res) {
        if (res.status != 201) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.CREATED);

    expect(user).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
    //confirm email
    await userRepository.update(user.id, { isActive: true });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: createUserDto.email,
        password: createUserDto.password,
      })
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(HttpStatus.OK);

    return;
  });

  afterAll(async () => {
    await app.close();
  });
});
