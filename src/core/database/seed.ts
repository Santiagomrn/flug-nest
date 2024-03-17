import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './migration';
import { seed } from './seedData';
import { logger } from '@core/logger/Logger';

async function main(): Promise<void> {
  try {
    logger.info(db.models);
    await seed();
    logger.info('SEED DONE');
    process.exit();
  } catch (err) {
    logger.error('ERROR EXECUTING SEED:', err);
    process.exit();
  }
}

main();
