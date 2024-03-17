import { Logger } from '@core/logger/Logger';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import _ from 'lodash';

@Injectable()
export class IsRoleGuard implements CanActivate {
  private logger: Logger = new Logger(IsRoleGuard.name);
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    try {
      const roles = this.reflector.get('roles', context.getHandler());
      const jwtRoles = req.session.jwt.roles.map((role) => role.name);
      const matchRoles = _.intersection(roles, jwtRoles);
      if (_.isEmpty(matchRoles)) return false;
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
