import { SequelizeCrudRepository } from '@libraries/SequelizeCrudRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FederatedCredential } from './entities/federatedCredential.entity';

@Injectable()
export class FederatedCredentialRepository extends SequelizeCrudRepository<FederatedCredential> {
  constructor(
    @InjectModel(FederatedCredential)
    protected model: typeof FederatedCredential,
    protected sequelize?: Sequelize,
  ) {
    super(sequelize);
  }

  async findOneByProviderAndSubject(provider: string, subject: string) {
    return await this.findOne({
      where: { provider, subject },
    });
  }
}
