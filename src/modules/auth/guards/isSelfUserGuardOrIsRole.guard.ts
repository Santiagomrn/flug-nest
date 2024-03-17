import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IsRoleGuard } from './isRole.guard';
import { IsSelfUserGuard } from './isSelfUser.guard';
import { Logger } from '@core/logger/Logger';

@Injectable()
export class IsSelfUserOrIsRoleGuard implements CanActivate {
  private logger: Logger = new Logger(IsSelfUserOrIsRoleGuard.name);
  constructor(
    private isRole: IsRoleGuard,
    private isSelfUser: IsSelfUserGuard,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      return (
        this.isRole.canActivate(context) || this.isSelfUser.canActivate(context)
      );
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
