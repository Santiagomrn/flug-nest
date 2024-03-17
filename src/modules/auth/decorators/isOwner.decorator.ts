import { SetMetadata, Type, UseGuards, applyDecorators } from '@nestjs/common';
import { IsOwnerGuard } from '../guards/isOwner.guard';
import { IFindOne } from '@libraries/intefaces/IFindOne';

export function IsOwner(serviceToken: Type<IFindOne>, key: string = 'userId') {
  return applyDecorators(
    SetMetadata('serviceToken', serviceToken),
    SetMetadata('key', key),
    UseGuards(IsOwnerGuard),
  );
}
