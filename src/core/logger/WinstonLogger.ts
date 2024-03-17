import { config } from '@config/index';
import { utilities } from 'nest-winston';
import path from 'path';
import winston from 'winston';

const logDir = path.join(process.cwd(), '/.logs');
let transports: winston.transport[] = [
  new winston.transports.Console({
    level: config.log.level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      utilities.format.nestLike(config.app.name, {
        colors: true,
        prettyPrint: true,
      }),
    ),
  }),
];
if (config.log.logToFiles) {
  transports = [
    ...transports,
    new winston.transports.File({
      level: 'error',
      filename: path.join(logDir, 'error.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      level: 'debug',
      filename: path.join(logDir, 'debug.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      level: 'info',
      filename: path.join(logDir, 'info.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      level: 'http',
      filename: path.join(logDir, 'http.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ];
}
export const winstonLogger = winston.createLogger({
  transports,
});
