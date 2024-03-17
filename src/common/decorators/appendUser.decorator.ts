import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AppendUserInterceptor } from '@interceptors/appendUser.interceptor';

export function AppendUser(appendUserToBodyKey: string = 'userId') {
  return applyDecorators(
    SetMetadata('appendUserToBodyKey', appendUserToBodyKey),
    UseInterceptors(AppendUserInterceptor),
  );
}
