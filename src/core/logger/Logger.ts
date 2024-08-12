import { LoggerService } from '@nestjs/common';
import winston from 'winston';
import { winstonLogger } from './WinstonLogger';

export class Logger implements LoggerService {
  private logger: winston.Logger = winstonLogger;
  constructor(public context: string = '') {}
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    optionalParams = optionalParams.map((optionalParam) => {
      if (typeof optionalParam === 'object' && optionalParam !== null)
        return JSON.stringify(optionalParam);
      return optionalParam;
    });
    winstonLogger.info(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }
  info(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    optionalParams = optionalParams.map((optionalParam) => {
      if (typeof optionalParam === 'object' && optionalParam !== null)
        return JSON.stringify(optionalParam);
      return optionalParam;
    });
    winstonLogger.info(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }
  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    winstonLogger.error(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    optionalParams = optionalParams.map((optionalParam) => {
      if (typeof optionalParam === 'object' && optionalParam !== null)
        return JSON.stringify(optionalParam);
      return optionalParam;
    });
    winstonLogger.error(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    optionalParams = optionalParams.map((optionalParam) => {
      if (typeof optionalParam === 'object' && optionalParam !== null)
        return JSON.stringify(optionalParam);
      return optionalParam;
    });
    winstonLogger.warn(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    optionalParams = optionalParams.map((optionalParam) => {
      if (typeof optionalParam === 'object' && optionalParam !== null)
        return JSON.stringify(optionalParam);
      return optionalParam;
    });
    winstonLogger.debug(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    winstonLogger.verbose(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }

  http(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object' && message !== null)
      message = JSON.stringify(message);
    winstonLogger.http(
      `[${this.context}] ` + message + optionalParams.join(''),
    );
  }
}
export const logger = new Logger();
