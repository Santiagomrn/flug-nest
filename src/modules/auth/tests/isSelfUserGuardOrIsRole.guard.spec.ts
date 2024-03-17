import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { IsRoleGuard } from '../guards/isRole.guard';
import { IsSelfUserGuard } from '../guards/isSelfUser.guard';
import { Reflector } from '@nestjs/core';
import { IsSelfUserOrIsRoleGuard } from '../guards/isSelfUserGuardOrIsRole.guard';

describe('Self User Guard testing...', () => {
  it('should return true when is self user or is role', async () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    });
    const reflector = new Reflector();
    const isRoleGuard = new IsRoleGuard(reflector);
    jest.spyOn(isRoleGuard, 'canActivate').mockResolvedValue(true);
    const isSelfUserGuard = new IsSelfUserGuard();
    jest.spyOn(isSelfUserGuard, 'canActivate').mockResolvedValue(true);
    const isSelfUserOrIsRoleGuard = new IsSelfUserOrIsRoleGuard(
      isRoleGuard,
      isSelfUserGuard,
    );
    expect(
      await isSelfUserOrIsRoleGuard.canActivate(mockExecutionContext),
    ).toEqual(true);
  });
});
