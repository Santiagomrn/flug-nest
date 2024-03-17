function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}
exports.generateFactories = (opts) => {
  const { name, belongsUser = false } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();

  const template = `import { faker } from '@faker-js/faker';
import { ${name} } from '../entities/${lowerCaseName}.entity';
import _ from 'lodash';
import { Create${name}Dto } from '../dto/create-${lowerCaseName}.dto';
import { plainToClass } from 'class-transformer';
import { Update${name}Dto } from '../dto/update-${lowerCaseName}.dto';

const createRandom${name} = (): ${name} => {
  return new ${name}({
    id: faker.number.int(),
    name: faker.company.name(),
    ${belongsUser ? 'userId: faker.number.int(),' : ''}
  });
};

export function ${name}Factory(count: number): ${name}[];
export function ${name}Factory(count?: number): ${name};
export function ${name}Factory(count: number): ${name}[] | ${name} {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandom${name}, { count });
  }
  return createRandom${name}();
}

const createRandomCreate${name}Dto = (): Create${name}Dto => {
  return plainToClass(Create${name}Dto, {
    name: faker.company.name(),
    ${belongsUser ? 'userId: faker.number.int(),' : ''}
  });
};

export function Create${name}DtoFactory(count: number): Create${name}Dto[];
export function Create${name}DtoFactory(count?: number): Create${name}Dto;
export function Create${name}DtoFactory(
  count: number,
): Create${name}Dto[] | Create${name}Dto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomCreate${name}Dto, { count });
  }
  return createRandomCreate${name}Dto();
}

const createRandomUpdate${name}Dto = (): Update${name}Dto => {
  return plainToClass(Update${name}Dto, {
    name: faker.company.name(),
  });
};

export function Update${name}DtoFactory(count: number): Update${name}Dto[];
export function Update${name}DtoFactory(count?: number): Update${name}Dto;
export function Update${name}DtoFactory(
  count: number,
): Update${name}Dto[] | Update${name}Dto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomUpdate${name}Dto, { count });
  }
  return createRandomUpdate${name}Dto();
}
`;
  return template;
};
exports.generateControllerSpec = (opts) => {
  const { name } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();
  const template = `import { Test, TestingModule } from '@nestjs/testing';
import { ${name}Controller } from '../${lowerCaseName}.controller';
import { ${name}Service } from '../${lowerCaseName}.service';
import {
  Create${name}DtoFactory,
  ${name}Factory,
  Update${name}DtoFactory,
} from './factories';
import { ${name} } from '../entities/${lowerCaseName}.entity';
import { testDatabaseModule } from '@core/database/testDatabase';
import { SequelizeModule } from '@nestjs/sequelize';
import { Create${name}Dto } from '../dto/create-${lowerCaseName}.dto';
import { Update${name}Dto } from '../dto/update-${lowerCaseName}.dto';
import { JwtService } from '@nestjs/jwt';

describe('${name} Controller', () => {
  let controller: ${name}Controller, service: ${name}Service;
  const createTestingModule = async () => {
    const mock${name}Service = {
      findOne: async () => {},
      findAll: async () => {},
      create: jest.fn(async (dto: Create${name}Dto) => {
        return ${name}.build({
          id: Math.round(Math.random() * (1000 - 1) + 1),
          ...dto,
        });
      }),
      update: jest.fn(async (id: number, dto: Update${name}Dto) => {
        return ${name}.build({
          id: id,
          ...dto,
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule, SequelizeModule.forFeature([${name}])],
      controllers: [${name}Controller],
      providers: [${name}Service, JwtService],
    })
      .overrideProvider(${name}Service)
      .useValue(mock${name}Service)
      .compile();

    return module;
  };

  beforeAll(async () => {
    const module = await createTestingModule();
    controller = module.get<${name}Controller>(${name}Controller);
    service = module.get<${name}Service>(${name}Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a ${lowerCaseName}', async () => {
    const mocked${name}: ${name} = ${name}Factory();
    jest.spyOn(service, 'findOne').mockImplementation(
      jest.fn(async (id) => {
        mocked${name}.id = id;
        return mocked${name};
      }),
    );
    expect(await controller.findOne(mocked${name}.id)).toStrictEqual(mocked${name});
  });

  it('should return an array of ${lowerCaseName}s', async () => {
    const mocked${name}s = ${name}Factory(10);
    jest.spyOn(service, 'findAll').mockImplementation(
      jest.fn(async () => {
        return { count: 10, limit: 10, offset: 0, data: mocked${name}s };
      }),
    );
    expect(await controller.findAll()).toStrictEqual({
      count: 10,
      limit: 10,
      offset: 0,
      data: mocked${name}s,
    });
  });

  it('should create a ${lowerCaseName}', async () => {
    const create${name}Dto: Create${name}Dto = Create${name}DtoFactory();
    expect(await controller.create(create${name}Dto)).toMatchObject({
      id: expect.any(Number),
      ...create${name}Dto,
    });
  });

  it('should update a ${lowerCaseName}', async () => {
    const update${name}Dto: Update${name}Dto = Update${name}DtoFactory();
    const id = 1;
    expect(await controller.update(id, update${name}Dto)).toMatchObject({
      id,
      ...update${name}Dto,
    });
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
`;
  return template;
};
exports.generateControllerE2E = (opts) => {
  const { name, belongsUser = false } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();
  const template = `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { testDatabaseModule } from '@core/database/testDatabase';
import { seed } from '@core/database/seedData';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ${name}Module } from '../${lowerCaseName}.module';
import { Create${name}DtoFactory, Update${name}DtoFactory } from './factories';
import { EmailModule } from '@modules/email/email.module';
${
  belongsUser
    ? "import { User } from '@modules/user/entities/user.entity';"
    : ''
}

describe('${name}Controller (e2e)', () => {
  let app: INestApplication;
  let token: string;
  ${belongsUser ? 'let user: Partial<User>;' : ''}
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        testDatabaseModule,
        UserModule,
        AuthModule,
        EmailModule,
        ${name}Module,
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
      ${belongsUser ? 'user = data.body.user;' : ''}
    token = data.body.token;
  });
  it('/${lowerCaseName}s (POST)', async () => {
    const create${name}Dto = Create${name}DtoFactory();
    const response = await request(app.getHttpServer())
      .post('/${lowerCaseName}s')
      .send(create${name}Dto)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(201);
    expect(response.body).toStrictEqual({
      ...create${name}Dto,
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ${belongsUser ? 'userId: user.id,' : ''}
    });
    return;
  });
  it('/${lowerCaseName}s (GET)', async () => {
    return request(app.getHttpServer())
      .get('/${lowerCaseName}s')
      .set('Authorization', \`Bearer \${token}\`)
      .expect(200);
  });
  it('/${lowerCaseName}s/:id (GET)', async () => {
    const create${name}Dto = Create${name}DtoFactory();
    const { body: ${lowerCaseName} } = await request(app.getHttpServer())
      .post('/${lowerCaseName}s')
      .send(create${name}Dto)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(201);
    const response = await request(app.getHttpServer())
      .get(\`/${lowerCaseName}s/\${${lowerCaseName}.id}\`)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(200);

    expect(response.body).toMatchObject({
      ...create${name}Dto,
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ${belongsUser ? 'userId: user.id,' : ''}
    });
    return;
  });
  it('/${lowerCaseName}s/:id (PATCH)', async () => {
    const create${name}Dto = Create${name}DtoFactory();
    const { body: ${lowerCaseName} } = await request(app.getHttpServer())
      .post('/${lowerCaseName}s')
      .send(create${name}Dto)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(201);

    const update${name}Dto = Update${name}DtoFactory();
    const response = await request(app.getHttpServer())
      .patch(\`/${lowerCaseName}s/\${${lowerCaseName}.id}\`)
      .set('Authorization', \`Bearer \${token}\`)
      .send(update${name}Dto)
      .expect(200);
    expect(response.body).toMatchObject({
      ...update${name}Dto,
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ${belongsUser ? 'userId: user.id,' : ''}
    });
    return;
  });
  it('/${lowerCaseName}s/:id (DELETE)', async () => {
    const create${name}Dto = Create${name}DtoFactory();
    const { body: ${lowerCaseName} } = await request(app.getHttpServer())
      .post('/${lowerCaseName}s')
      .send(create${name}Dto)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(201);
    return request(app.getHttpServer())
      .delete(\`/${lowerCaseName}s/\${${lowerCaseName}.id}\`)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
`;
  return template;
};
