import { Model } from 'sequelize-typescript';

export interface IFindOne {
  findOne: (id: number | string) => Promise<Model>;
}
