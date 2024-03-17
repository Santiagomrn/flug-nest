import { Logger } from '@core/logger/Logger';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Model } from 'sequelize-typescript';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  private logger: Logger = new Logger(IsOwnerGuard.name);
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let service: { findOne: (id: number | string) => Promise<Model> };
    const req = context.switchToHttp().getRequest<Request>();
    try {
      const serviceToken = this.reflector.get(
        'serviceToken',
        context.getHandler(),
      );
      const key = this.reflector.get('key', context.getHandler());
      service = await this.moduleRef.get(serviceToken);
      const userId = req.session.jwt.id;

      if (userId == null) return false;
      const id: number = parseInt(req.params.id);

      if (id == null) return false;
      const entity = await service.findOne(id);

      if (!entity) return false;

      if (entity[key] !== userId) return false;

      req.session.instance = entity;
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
