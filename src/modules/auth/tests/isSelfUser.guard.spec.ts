import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { ROLES } from '@modules/role/enums/roles.enum';
import { IsSelfUserGuard } from '../guards/isSelfUser.guard';

describe('Self User Guard testing...', () => {
  it('should return true when user id and id in params are equal', async () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'auth',
          },
          session: {
            jwt: {
              id: 1,
              roles: [{ name: ROLES.ADMIN }],
            },
          },
          params: {
            id: 1,
          },
        }),
      }),
    });
    const isRoleGuard = new IsSelfUserGuard();
    expect(await isRoleGuard.canActivate(mockExecutionContext)).toEqual(true);
  });
});
