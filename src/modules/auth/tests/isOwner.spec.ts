import { ExecutionContext } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';
import { ROLES } from '@modules/role/enums/roles.enum';
import { IsOwnerGuard } from '../guards/isOwner.guard';

describe('IsOwner Guard testing...', () => {
  it('should return true when jwt.Id and userId are equal', async () => {
    const reflector = new Reflector();
    const moduleRef = { get: () => {} } as unknown as ModuleRef;
    const mockService = {
      findOne: () => {
        return { id: 1, userId: 2 };
      },
    };
    jest.spyOn(reflector, 'get').mockReturnValue('userId');
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'auth',
          },
          params: {
            id: 1,
          },
          session: {
            jwt: {
              id: 2,
              roles: [{ name: ROLES.ADMIN }],
            },
          },
        }),
      }),
    });
    jest.spyOn(moduleRef, 'get').mockReturnValue(mockService);
    jest.spyOn(mockService, 'findOne').mockReturnValue({ id: 4, userId: 2 });
    const isRoleGuard = new IsOwnerGuard(reflector, moduleRef);
    expect(await isRoleGuard.canActivate(mockExecutionContext)).toEqual(true);
  });
});
