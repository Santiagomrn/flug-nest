import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AppendToBodyInterceptor } from '@interceptors/appendToBody.interceptor';

export function AppendToBody<T>(appendToBodyData: Partial<T> = {}) {
  return applyDecorators(
    SetMetadata('appendToBodyData', appendToBodyData),
    UseInterceptors(AppendToBodyInterceptor),
  );
}
