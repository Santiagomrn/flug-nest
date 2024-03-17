import { Logger } from '@core/logger/Logger';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ValidateJWTGuard implements CanActivate {
  private logger: Logger = new Logger(ValidateJWTGuard.name);
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      const token = this.getToken(request);
      this.jwtService.verify(token);
      request['session'] = {
        ...request['session'],
        jwt: this.jwtService.decode(token),
      };
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }
  getToken(request: Request) {
    const authorization: string = request.get('Authorization');
    if (!authorization) {
      throw new BadRequestException('Authorization header is not present');
    }
    let token: string | null = null;
    const parts: Array<string> = authorization.split(' ');
    if (parts.length === 2) {
      const scheme: string = parts[0];
      const credentials: string = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }
    return token;
  }
}
