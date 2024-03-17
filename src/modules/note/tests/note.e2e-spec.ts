import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { testDatabaseModule } from '@core/database/testDatabase';
import { seed } from '@core/database/seedData';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { NoteModule } from '../note.module';
import { CreateNoteDtoFactory, UpdateNoteDtoFactory } from './factories';
import { User } from '@modules/user/entities/user.entity';
import { EmailModule } from '@modules/email/email.module';

describe('NoteController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let user: Partial<User>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        testDatabaseModule,
        UserModule,
        AuthModule,
        NoteModule,
        EmailModule,
      ],
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
        email: 'user@example.com',
        password: 'Passw0rd',
      })
      .expect(200);
    user = data.body.user;
    token = data.body.token;
  });
  it('/notes (POST)', async () => {
    const createNoteDto = CreateNoteDtoFactory();
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send(createNoteDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(response.body).toMatchObject({
      ...createNoteDto,
      id: expect.any(Number),
      userId: user.id,
    });
    return;
  });
  it('/notes (GET)', async () => {
    return request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
  it('/notes/:id (GET)', async () => {
    const createNoteDto = CreateNoteDtoFactory();
    const { body: note } = await request(app.getHttpServer())
      .post('/notes')
      .send(createNoteDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const response = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      ...createNoteDto,
      id: expect.any(Number),
      userId: user.id,
    });
    return;
  });
  it('/notes/:id (PATCH)', async () => {
    const createNoteDto = CreateNoteDtoFactory();
    const { body: note } = await request(app.getHttpServer())
      .post('/notes')
      .send(createNoteDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const updateNoteDto = UpdateNoteDtoFactory();
    const response = await request(app.getHttpServer())
      .patch(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateNoteDto)
      .expect(200);
    expect(response.body).toMatchObject({
      ...updateNoteDto,
      id: expect.any(Number),
      userId: user.id,
    });
    return;
  });
  it('/notes/:id (DELETE)', async () => {
    const createNoteDto = CreateNoteDtoFactory();
    const { body: note } = await request(app.getHttpServer())
      .post('/notes')
      .send(createNoteDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    return request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
