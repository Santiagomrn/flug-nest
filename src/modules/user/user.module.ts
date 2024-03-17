import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { RoleModule } from '@modules/role/role.module';
import { IsRoleGuard } from '@modules/auth/guards/isRole.guard';
import { IsSelfUserGuard } from '@modules/auth/guards/isSelfUser.guard';

@Module({
  imports: [SequelizeModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, IsRoleGuard, IsSelfUserGuard],
  exports: [SequelizeModule, UserService, UserRepository],
})
export class UserModule {}
