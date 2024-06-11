import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import path from 'path';
dotenv.config();
export const config = {
  app: {
    name: process.env.APP_NAME || 'FLUG-NEST',
  },
  root: path.normalize(`${__dirname}/..`),

  env: process.env.NODE_ENV || 'development',

  apiServer: process.env.API_URL,

  server: {
    port: process.env.SERVER_PORT || 3000,
  },

  api: {
    // Default limit and offset levels for responses
    limit: 10,
    offset: 0,
    page: 1,
    // Show detailed error responses or not
    debug: true,
    order: [['id', 'ASC']],
    properties: ['id'],
  },

  email: {
    from_address:
      process.env.EMAIL_FROM_ADDRESS || 'MyApp <no-reply@example.com>',
    host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_SMPT_PORT
      ? parseInt(process.env.EMAIL_SMPT_PORT)
      : 587,
    secure: process.env.EMAIL_SMTP_SECURE
      ? process.env.EMAIL_SMTP_SECURE === 'true'
      : true,
    auth: {
      user: process.env.EMAIL_SMTP_USER || '(your SMTP user)',
      pass: process.env.EMAIL_SMTP_PASS || '(your SMTP password)',
    },
  },
  urls: {
    // Url config as seen from the user NOT NECESSARILY THE SAME AS SERVER
    // http or https
    protocol: process.env.URLS_PROTOCOL || 'http',
    url: process.env.URLS_URL || 'localhost',
    port: process.env.URLS_PORT ? String(process.env.URLS_PORT) : '3000',
    //suggested path /api
    apiRoot: process.env.URLS_API_ROOT || '',
    base: '',
    baseApi: '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '<%- jwt_secret %>',
    access: {
      expiry: {
        unit: 'hours',
        length: process.env.JWT_EXPIRY_HOURS
          ? parseInt(process.env.JWT_EXPIRY_HOURS)
          : 30 * 24,
      },
      subject: 'access',
      audience: 'user',
    },
    refresh: {
      expiry: {
        unit: 'months',
        length: 6,
      },
      subject: 'refresh',
      audience: 'user',
    },
    reset: {
      expiry: {
        unit: 'hours',
        length: 1,
      },
      subject: 'reset',
      audience: 'user',
    },
    confirm: {
      expiry: {
        unit: 'hours',
        length: 1,
      },
      subject: 'confirm',
      audience: 'user',
    },
  },
  log: {
    // Console Log levels: error, warn, info, verbose, debug, silly
    level: process.env.LOG_LEVEL || 'http',
    logToFiles: process.env.LOG_TO_FILES
      ? process.env.LOG_TO_FILES === 'true'
      : false,
  },
  swagger: {
    route: process.env.SWAGGER_ROUTE || 'swagger',
    username: process.env.SWAGGER_USERNAME || 'admin',
    password: process.env.SWAGGER_PASSWORD || 'password',
    hasAuth: Boolean(process.env.SWAGGER_HAS_AUTH) || false,
  },
  db: {
    database: process.env.DB_NAME || 'test',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_TYPE || 'sqlite') as Dialect,
    storage: null,
    logging: false,
    timezone: 'utc', // IMPORTANT For correct timezone management with DB.
  },
  azure: {
    serviceBus: {
      connectionString: process.env.AZURE_SERVICEBUS_CONNECTION_STRING || '',
      queueExample: {
        name: process.env.AZURE_SERVICEBUS_QUEUEEXAMPLE_NAME || '',
      },
      topicExample: {
        name: process.env.AZURE_SERVICEBUS_EXAMPLE_TOPICNAME || '',
        subscription: process.env.AZURE_SERVICEBUS_TOPICEXAMPLE_NAME || '', //this is only required for receiver/client
      },
    },
  },
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'use your own credentials',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'use your own credentials',
    },
  },
  test: {
    db: {
      database: process.env.TEST_DB_NAME || 'sqlite_db',
      storage: ':memory:',
      username: process.env.TEST_DB_USER || 'root',
      password: process.env.TEST_DB_PASSWORD || 'root',
      host: process.env.TEST_DB_HOST || 'localhost',
      dialect: (process.env.TEST_DB_TYPE || 'sqlite') as Dialect,
      logging: false,
    },
  },
};

let portString = '';
if (Number.isInteger(parseInt(config.urls.port)))
  portString = `:${config.urls.port}`;

config.urls.base = `${config.urls.protocol}://${config.urls.url}${portString}`;
config.urls.baseApi = `${config.urls.base}${config.urls.apiRoot}`;

if (config.db.dialect === 'sqlite') {
  // sqlite dialect doesn't support timezone and crashes if we pass one (it is utc by default anyway)
  delete config.db.timezone;
  config.db.storage = path.join(
    __dirname,
    '../../src/core/database/database.sqlite',
  );
}
