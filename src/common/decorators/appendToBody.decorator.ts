import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AppendToBodyInterceptor } from '@interceptors/appendToBody.interceptor';

export function AppendToBody(appendToBodyData: object = {}) {
  return applyDecorators(
    SetMetadata('appendToBodyData', appendToBodyData),
    UseInterceptors(AppendToBodyInterceptor),
  );
}
