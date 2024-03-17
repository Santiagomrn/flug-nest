import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { testDatabaseModule } from '@core/database/testDatabase';
import { seed } from '@core/database/seedData';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { CreateUserDtoFactory, UpdateUserDtoFactory } from './factories';
import { UserModule } from '../user.module';
import _ from 'lodash';
import { EmailModule } from '@modules/email/email.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule, UserModule, AuthModule, EmailModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    await seed();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });
  beforeEach(async () => {
    const data = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Passw0rd',
      })
      .expect(200);
    token = data.body.token;
  });
  it('/users (POST)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(function (res) {
        if (res.status != 201) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(201);

    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
    return;
  });
  it('/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(function (res) {
        if (res.status != 200) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      })
      .expect(200);
  });
  it('/users/:id (GET)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const responseUser = _.omit(createUserDto, ['password']);
    const { body: user } = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
    return;
  });
  it('/users/:id (PATCH)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const { body: user } = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const updateUserDto = UpdateUserDtoFactory();
    const responseUser = _.omit(updateUserDto, ['password']);
    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateUserDto)
      .expect(200);
    expect(response.body).toMatchObject({
      ...responseUser,
      id: expect.any(Number),
    });
    return;
  });
  it('/users/:id (DELETE)', async () => {
    const createUserDto = CreateUserDtoFactory();
    const { body: user } = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    return request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
