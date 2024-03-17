import { SequelizeCrudRepository } from 'src/libraries/SequelizeCrudRepository';
import { Role } from './entities/role.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';

@Injectable()
export class RoleRepository extends SequelizeCrudRepository<Role> {
  constructor(
    @InjectModel(Role)
    protected model: typeof Role,
    protected sequelize?: Sequelize,
  ) {
    super(sequelize);
  }
  async findByName(name: string, t = null) {
    if (_.isNil(name))
      throw new NotFoundException(`Role with ${name} name Not Found`);
    const role = await this.model.findOne({ where: { name }, transaction: t });
    if (_.isNil(role))
      throw new NotFoundException(`Role with ${name} name Not Found`);
    return role;
  }
}
