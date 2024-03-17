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
export class AppendToBodyInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const object: object = this.reflector.get(
        'appendToBodyData',
        context.getHandler(),
      );
      req.body = { ...req.body, ...object };
      return next.handle();
    } catch (e) {
      throw new HttpException(
        `AppendToBodyInterceptor`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
