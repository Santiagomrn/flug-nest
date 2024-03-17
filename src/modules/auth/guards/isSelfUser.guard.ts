import { Logger } from '@core/logger/Logger';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class IsSelfUserGuard implements CanActivate {
  private logger: Logger = new Logger(IsSelfUserGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    try {
      const id = req.session.jwt.id;
      if (id == null) return false;
      if (id !== parseInt(req.params.id)) return false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }
}
