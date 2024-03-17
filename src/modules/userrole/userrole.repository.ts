import { SequelizeCrudRepository } from 'src/libraries/SequelizeCrudRepository';
import { UserRole } from './entities/userrole.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserRoleRepository extends SequelizeCrudRepository<UserRole> {
  constructor(
    @InjectModel(UserRole)
    protected model: typeof UserRole,
    protected sequelize?: Sequelize,
  ) {
    super(sequelize);
  }
}
