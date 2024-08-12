import { SetMetadata, Type, UseGuards, applyDecorators } from '@nestjs/common';
import { IsOwnerGuard } from '../guards/isOwner.guard';
import { IFindOne } from '@libraries/intefaces/IFindOne';
import { Plain } from '@libraries/baseModel.entity';
import { Model } from 'sequelize-typescript';

export function IsOwner<T extends Model<T>>(
  serviceToken: Type<IFindOne>,
  key: keyof Plain<T> | 'userId' = 'userId',
) {
  return applyDecorators(
    SetMetadata('serviceToken', serviceToken),
    SetMetadata('key', key),
    UseGuards(IsOwnerGuard),
  );
}
