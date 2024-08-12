import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AppendUserWSInterceptor } from '../interceptors/appendUserWS.Interceptor';

export function AppendUserWS<T>(
  appendUserToBodyKey: keyof T | 'userId' = 'userId',
) {
  return applyDecorators(
    SetMetadata('appendUserToBodyKey', appendUserToBodyKey),
    UseInterceptors(AppendUserWSInterceptor),
  );
}
