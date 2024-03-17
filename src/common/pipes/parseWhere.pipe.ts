import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import _ from 'lodash';
import { Op } from 'sequelize';

const OPERATOR_ALIASES = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $iLike: Op.iLike,
  $notLike: Op.notLike,
  $notILike: Op.notILike,
  $startsWith: Op.startsWith,
  $endsWith: Op.endsWith,
  $substring: Op.substring,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $and: Op.and,
  $or: Op.or,
  $contains: Op.contains,
};
@Injectable()
export class ParseWherePipe implements PipeTransform {
  private logger: Logger = new Logger(ParseWherePipe.name);
  transform(value: string, metadata: ArgumentMetadata) {
    const whereValue = value ?? '[]';
    if (Array.isArray(whereValue)) return whereValue;
    try {
      return ParseWherePipe.parseWhereString(whereValue);
    } catch (e) {
      console.log(e);
      this.logger.error(e);
      throw new HttpException(
        `Validation failed (Array string is expected) for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static parseWhereString(whereValue: string) {
    let where: object[] = JSON.parse(whereValue);
    if (!_.isArray(where)) {
      where = [];
    }
    // Omit any undefined values
    where = where.filter((p) => p != undefined);
    const sanitizedWhere = ParseWherePipe.sanitizeWhere(where);
    return sanitizedWhere;
  }
  static sanitizeWhere(where: any): object[] {
    const recursiveParse = (obj: any) => {
      _.each(obj, (val: any, key: any) => {
        if (OPERATOR_ALIASES.hasOwnProperty(key)) {
          obj[OPERATOR_ALIASES[key]] = val;
          delete obj[key];
        }
        if (_.isObjectLike(val)) recursiveParse(val);
      });
    };
    recursiveParse(where);
    return where;
  }
}
