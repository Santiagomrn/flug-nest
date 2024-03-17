import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import _ from 'lodash';

@Injectable()
export class ParseAttributesPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // Look for explicitly specified `attributes` parameter.
    let attributes: string = value;
    // validated object keys
    if (!_.isNil(attributes)) attributes = this.sanitizeAttributes(attributes);

    if (!_.isArray(attributes) && !_.isNil(attributes))
      throw new HttpException(
        `Validation failed (Array string is expected) for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    return attributes;
  }
  sanitizeAttributes(attributes: any): any {
    // If `attributes` parameter is a string, try to interpret it as JSON
    if (_.isString(attributes)) {
      try {
        attributes = JSON.parse(attributes);
      } catch (e) {
        throw new HttpException(
          `Validation failed (Array string is expected) for attributes`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    // if is array, leave as it is
    if (_.isArray(attributes)) {
      return attributes;
    }

    return attributes;
  }
}
