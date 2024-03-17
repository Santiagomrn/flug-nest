import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { config } from 'src/config';
@Injectable()
export class ParseLimitPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    let limit = value ? parseInt(value) : config.api.limit;
    if (isNaN(limit))
      throw new HttpException(
        `Validation failed (numeric string is expected) for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    if (limit > 1000) {
      limit = 1000;
    }
    if (limit < 1) {
      limit = 1;
    }
    const result: number = limit;
    return result;
  }
}
