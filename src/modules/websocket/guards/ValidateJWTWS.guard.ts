import { Logger } from '@core/logger/Logger';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
@Injectable()
export class ValidateJWTWSGuard implements CanActivate {
  private logger: Logger = new Logger(ValidateJWTWSGuard.name);
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const socket = context.switchToWs().getClient<Socket>();
    try {
      const token = socket.handshake.auth.token;
      this.jwtService.verify(token);
      socket.data = {
        jwtPayload: this.jwtService.decode(token),
      };
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }
}
