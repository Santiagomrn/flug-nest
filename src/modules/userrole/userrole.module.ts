import { Global, Module } from '@nestjs/common';


import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole } from './entities/userrole.entity';
import { UserRoleRepository } from './userrole.repository';
@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserRole])],
  controllers: [],
  providers: [UserRoleRepository],
  exports: [SequelizeModule],
})
export class UserRoleModule {}
