import { config } from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from './core/logger/Logger';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';
import { PaginatedDto } from '@common/dto/paginated.dto';
import { AzureServiceBusServer } from 'nestjs-azure-service-bus-transporter';

async function bootstrap() {
  let logger: Logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  //Microservices Hybrid application (ServiceBus)
  await app.connectMicroservice({
    strategy: new AzureServiceBusServer({
      connectionString: config.azure.serviceBus.connectionString,
      options: {},
    }),
  });
  await app.startAllMicroservices();

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
  if (config.swagger.hasAuth) {
    const basicAuthMiddleware = expressBasicAuth({
      users: {
        [`${config.swagger.username}`]: config.swagger.password,
      },
      challenge: true,
    });
    //UI swagger view
    app.use(`/${config.swagger.route}`, basicAuthMiddleware);
    //JSON swagger view
    app.use(`/${config.swagger.route}-json`, basicAuthMiddleware);
  }

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
      validateCustomDecorators: true, //https://docs.nestjs.com/custom-decorators
    }),
  );
  app.enableShutdownHooks();
  await app.listen(config.server.port);
  logger.info(`Server started at port ${config.server.port}`);
}
bootstrap();
