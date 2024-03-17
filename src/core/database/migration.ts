import { Sequelize } from 'sequelize-typescript';
import { databaseConfigOptions } from './config';
export const db = new Sequelize(databaseConfigOptions);
