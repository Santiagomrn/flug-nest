import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilterOwnerInterceptor } from '@interceptors/filterOwner.interceptor';

export function FilterOwner(key: string = 'userId') {
  return applyDecorators(
    SetMetadata('key', key),
    UseInterceptors(FilterOwnerInterceptor),
  );
}
