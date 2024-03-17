import { LoggerService } from '@nestjs/common';
import winston from 'winston';
import { winstonLogger } from './WinstonLogger';

export class Logger implements LoggerService {
  private logger: winston.Logger = winstonLogger;
  constructor(public context: string = '') {}
  /**
   * Write a 'log' level log.
   */
  log(...message: any) {
    winstonLogger.info(`[${this.context}] ` + message.join(''));
  }
  info(...message: any) {
    winstonLogger.info(`[${this.context}] ` + message.join(''));
  }
  /**
   * Write a 'fatal' level log.
   */
  fatal(...message: any) {
    winstonLogger.error(`[${this.context}] ` + message.join(''));
  }

  /**
   * Write an 'error' level log.
   */
  error(...message: any) {
    winstonLogger.error(`[${this.context}] ` + message.join(''));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(...message: any) {
    winstonLogger.warn(`[${this.context}] ` + message.join(''));
  }

  /**
   * Write a 'debug' level log.
   */
  debug(...message: any) {
    winstonLogger.debug(`[${this.context}] ` + message.join(''));
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(...message: any) {
    winstonLogger.verbose(`[${this.context}] ` + message.join(''));
  }

  http(...message: any) {
    winstonLogger.http(`[${this.context}] ` + message.join(''));
  }
}
export const logger = new Logger();
