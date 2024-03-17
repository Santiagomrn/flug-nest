import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  controllers: [],
  providers: [RoleRepository],
  exports: [SequelizeModule, RoleRepository],
})
export class RoleModule {}
