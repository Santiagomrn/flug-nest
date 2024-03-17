import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IsRoleGuard } from '../guards/isRole.guard';
import { createMock } from '@golevelup/ts-jest';
import { ROLES } from '@modules/role/enums/roles.enum';

describe('Role Guard testing...', () => {
  it('should return true when roles intersect', async () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'get').mockReturnValue([ROLES.ADMIN]);
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'auth',
          },
          session: {
            jwt: {
              roles: [{ name: ROLES.ADMIN }],
            },
          },
        }),
      }),
    });
    const isRoleGuard = new IsRoleGuard(reflector);
    expect(await isRoleGuard.canActivate(mockExecutionContext)).toEqual(true);
  });
});
