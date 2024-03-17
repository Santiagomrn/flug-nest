import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { IsRoleGuard } from '../guards/isRole.guard';

export function IsRole(...roles: string[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(IsRoleGuard));
}
