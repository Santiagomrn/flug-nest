import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { config } from 'src/config';
@Injectable()
export class ParseOffsetPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    let offset = value ? parseInt(value) : config.api.offset;
    if (isNaN(offset))
      throw new HttpException(
        `Validation failed (numeric string is expected) for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );

    if (offset < 0) {
      offset = 0;
    }
    const result: number = offset;
    return result;
  }
}
