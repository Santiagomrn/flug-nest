import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import _ from 'lodash';
import { config } from 'src/config';
@Injectable()
export class ParseOrderPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    try {
      let sort: any = value;
      if (sort === undefined) {
        return config.api.order;
      }

      // If `sort` is a string, attempt to JSON.parse() it.
      // (e.g. `[["Id","ASC"]]`)
      if (_.isString(sort)) {
        try {
          sort = JSON.parse(sort);
        } catch (e) {
          // If it is not valid JSON, then fall back to interpreting it as-is.
          // (e.g. "name ASC")
          // Put it in array form for avoiding errors with reserved words
          try {
            const parts: Array<string> = sort.split(' ');
            const colName: string = parts[0];
            const orderParam: string = parts[1];
            if (orderParam !== 'ASC' && orderParam !== 'DESC')
              throw new Error('invalid query');
            sort = [[colName, orderParam]];
          } catch (e) {
            // Invalid string
            sort = '';
          }
        }
      }
      return sort;
    } catch (err) {
      throw new HttpException(
        `Validation failed for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
