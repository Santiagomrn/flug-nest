import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AppendUserInterceptor } from '@interceptors/appendUser.interceptor';

export function AppendUser<T>(
  appendUserToBodyKey: keyof T | 'userId' = 'userId',
) {
  return applyDecorators(
    SetMetadata('appendUserToBodyKey', appendUserToBodyKey),
    UseInterceptors(AppendUserInterceptor),
  );
}
