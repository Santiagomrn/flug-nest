import { SequelizeCrudRepository } from 'src/libraries/SequelizeCrudRepository';
import { User } from './entities/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '@modules/role/entities/role.entity';
import _ from 'lodash';
import { Transaction } from 'sequelize';

@Injectable()
export class UserRepository extends SequelizeCrudRepository<User> {
  constructor(
    @InjectModel(User)
    protected model: typeof User,
    protected sequelize?: Sequelize,
  ) {
    super(sequelize);
  }
  async create(reg: Partial<User>, transaction?: Transaction): Promise<User> {
    await this.notExistsByEmail(reg.email, transaction);
    return await super.create(reg, transaction);
  }
  async findOneByEmailAndIsActiveTrueIncludeRole(
    email: string,
    transaction?: Transaction,
  ) {
    if (_.isNil(email))
      throw new NotFoundException(`User with ${email} email Not Found`);
    const user = await this.findOne(
      {
        where: { email, isActive: true },
        include: [Role],
      },
      transaction,
    );
    return user;
  }
  async findOneByEmailAndIsNotACtiveAndIsNotEmailConfirmed(
    email: string,
    transaction?: Transaction,
  ) {
    if (_.isNil(email))
      throw new NotFoundException(`User with ${email} email Not Found`);
    const user = await this.findOne(
      {
        where: { email, isActive: false, isEmailConfirmed: false },
        include: [Role],
      },
      transaction,
    );
    return user;
  }
  async findOneByEmail(email: string, transaction?: Transaction) {
    if (_.isNil(email))
      throw new NotFoundException(`User with ${email} email Not Found`);
    const user = await this.findOne(
      {
        where: { email },
      },
      transaction,
    );
    return user;
  }

  async notExistsByEmail(email: string, transaction?: Transaction) {
    try {
      await this.findOneByEmail(email, transaction);
      throw new ConflictException('Email Already exists');
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
    }
  }
}
