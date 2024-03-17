import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../../core/database/migration';
import path from 'path';
import { SequelizeStorage, Umzug } from 'umzug';
import { logger } from '@core/logger/Logger';

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, './../../core/database/migrations/*.js'),
  },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger,
});

async function main() {
  try {
    await umzug.up();
    logger.info('MIGRATIONS DONE');
  } catch (err) {
    logger.error(err);
    process.exit();
  }
  process.exit();
}

main();
