import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class AppendUserWSInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    try {
      const client = context.switchToWs().getClient<Socket>();
      const data = context.switchToWs().getData();
      const key: string = this.reflector.get(
        'appendUserToBodyKey',
        context.getHandler(),
      );
      data[key] = client.data.jwtPayload.id;
      return next.handle();
    } catch (e) {
      throw new HttpException(`AppendUserInterceptor`, HttpStatus.BAD_REQUEST);
    }
  }
}
