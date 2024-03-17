import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfigOptions } from './config';
import { config } from '../../config';

export const testDatabaseModule = SequelizeModule.forRoot({
  models: databaseConfigOptions.models,
  modelMatch: databaseConfigOptions.modelMatch,
  ...config.test.db,
  autoLoadModels: true,
});
