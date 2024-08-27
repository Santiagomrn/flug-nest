import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilterOwnerInterceptor } from '@interceptors/filterOwner.interceptor';
import { Plain } from '@libraries/baseModel.entity';
import { Model } from 'sequelize-typescript';

export function FilterOwner<T extends Model>(
  key: keyof Plain<T> | 'userId' = 'userId',
) {
  return applyDecorators(
    SetMetadata('key', key),
    UseInterceptors(FilterOwnerInterceptor),
  );
}
