import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfigOptions } from './config';
export const DatabaseModule = SequelizeModule.forRoot({
  ...databaseConfigOptions,
  autoLoadModels: true,
});
