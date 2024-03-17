import { UseGuards, applyDecorators } from '@nestjs/common';
import { IsSelfUserGuard } from '../guards/isSelfUser.guard';

/*
  Checks if the requested user is self
  ** Only applicable to UserController
*/
export function IsSelfUser() {
  return applyDecorators(UseGuards(IsSelfUserGuard));
}
