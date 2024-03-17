import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from './core/logger/Logger';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './config';
import expressBasicAuth from 'express-basic-auth';
import { PaginatedDto } from '@common/dto/paginated.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  //SECURITY
  app.use(helmet());

  //VERSIONING
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  //CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  //MORGAN REQUEST LOGS
  app.use(
    morgan.default(
      ':remote-addr :remote-user :method :url HTTP/:http-version  :status :res[content-length] - :response-time ms',
      {
        stream: {
          write: (message) => {
            new Logger('Morgan').http(message.trim());
          },
        },
      },
    ),
  );

  //SWAGGER auth
  if (config.swagger.hasAuth)
    app.use(
      `/${config.swagger.route}`,
      expressBasicAuth({
        users: {
          [`${config.swagger.username}`]: config.swagger.password,
        },
        challenge: true,
      }),
    );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${config.app.name}`)
    .setDescription(`The ${config.app.name} API description`)
    .setVersion('1.0')
    .addServer(
      `${config.urls.protocol}://${config.urls.url}${
        config.urls.port.length ? ':' : ''
      }${config.urls.port}${config.urls.apiRoot}`,
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [PaginatedDto],
  });
  SwaggerModule.setup(`${config.swagger.route}`, app, document);

  //VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  app.enableShutdownHooks();
  await app.listen(config.server.port);
}
bootstrap();
