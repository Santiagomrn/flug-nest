import { ArrayWhereOptions } from '@libraries/baseModel.entity';
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
import queryString from 'node:querystring';

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
  transform(value: string | ArrayWhereOptions[], metadata: ArgumentMetadata) {
    if (Array.isArray(value)) return value;
    const whereValue = value ?? '[]';
    try {
      return ParseWherePipe.parseWhereString(whereValue) as ArrayWhereOptions;
    } catch (e) {
      console.log(e);
      this.logger.error(e);
      throw new HttpException(
        `Validation failed (Array string is expected) for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static parseWhereString(undecodedWhereValue: string) {
    let { whereValue } = queryString.decode(
      'whereValue=' + undecodedWhereValue,
    );
    if (!_.isString(whereValue)) return [];
    whereValue = whereValue.replace(/:"%\$/g, ':"%');

    let where: object[] = JSON.parse(whereValue);
    if (!_.isArray(where)) {
      where = [];
    }
    // Omit any undefined values
    where = where.filter((p) => p != undefined);
    const sanitizedWhere = ParseWherePipe.sanitizeWhere(where);
    return sanitizedWhere as ArrayWhereOptions;
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
