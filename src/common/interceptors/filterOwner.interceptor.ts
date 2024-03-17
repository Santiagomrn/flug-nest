import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ParseWherePipe } from '@pipes/parseWhere.pipe';
import { Request } from 'express';
import _ from 'lodash';
import { Observable } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class FilterOwnerInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.switchToHttp().getRequest<Request>();
    const key = this.reflector.get('key', context.getHandler());
    const whereElement = { [key]: req.session.jwt.id };
    req.session.where = Array.isArray(req.session.where)
      ? [...req.session.where, whereElement]
      : [whereElement];

    let reqWhere = req.query.where;
    if (_.isString(reqWhere)) {
      reqWhere = ParseWherePipe.parseWhereString(reqWhere);
      req.query.where = reqWhere;
    }

    if (Array.isArray(reqWhere)) {
      req.query.where = [...req.session.where, ...req.query.where];
    }
    if (_.isNil(req.query.where)) req.query.where = [...req.session.where];
    return next.handle();
  }
}

// const whereValue = req.query?.where ?? '[]';
// try {
//   let where: object[] = JSON.parse(whereValue);
//   if (!_.isArray(where)) {
//     where = [];
//   }
//   // Omit any undefined values
//   where = where.filter((p) => p != undefined);
//   const key = this.reflector.get('key', context.getHandler());
//   where.push({ [key]: req.session.jwt.id });
//   req.query.where = JSON.stringify(where);
//   return next.handle();
// } catch (e) {
//   throw new HttpException(
//     `Validation failed (Array string is expected) for where`,
//     HttpStatus.BAD_REQUEST,
//   );
// }
