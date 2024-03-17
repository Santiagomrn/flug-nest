import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { IsSelfUserOrIsRoleGuard } from '../guards/isSelfUserGuardOrIsRole.guard';

export function IsSelfUserOrIsRole(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(IsSelfUserOrIsRoleGuard),
  );
}
