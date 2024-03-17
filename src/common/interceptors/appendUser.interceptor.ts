import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class AppendUserInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const key: string = this.reflector.get(
        'appendUserToBodyKey',
        context.getHandler(),
      );
      req.body = { ...req.body, [key]: req.session.jwt.id };
      return next.handle();
    } catch (e) {
      throw new HttpException(`AppendUserInterceptor`, HttpStatus.BAD_REQUEST);
    }
  }
}
