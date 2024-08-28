import { config } from '@config/index';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class HttpUnauthorizedExceptionFilter implements ExceptionFilter {
  public catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.redirect(HttpStatus.FOUND, config.oauth.fail.redirect);
  }
}
