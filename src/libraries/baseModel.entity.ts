import { FindOptions } from 'sequelize';
import {
  AssociationActionOptions,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Sequelize,
  UpdatedAt,
} from 'sequelize-typescript';

/* 
  BaseModel: 
  All models inherit from this class, 
  modify it to apply defaults to all your models.
*/
export abstract class BaseModel<
  T extends BaseModel = any,
  K extends BaseModel = T,
> extends Model<T, K> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: true,
  })
  id: number;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;

  toJSON(): Plain<T> {
    return super.toJSON() as Plain<T>;
  }
}

interface HasUnwantedFunction {
  reload(options?: FindOptions): Promise<this>;
  $add<R extends Model>(
    propertyKey: string,
    instances: R | R[] | string[] | string | number[] | number,
    options?: AssociationActionOptions,
  ): Promise<unknown>;
}
export type Plain<T extends Model<T>, k = {}> = OmitFunctions<
  MagicToExtractRealType<T>
> &
  IsNotModel<k>;

export type IsNotModel<T> = T extends HasUnwantedFunction
  ? 'Not a plain Model use Model.toJson()'
  : T;

type OmitFunctions<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T as T[P] extends Function ? never : P]: T[P];
};
type MagicToExtractRealType<T extends Model<T>> = Omit<
  T,
  | 'isInitialized'
  | 'init'
  | '$add'
  | '$set'
  | '$get'
  | '$count'
  | '$create'
  | '$has'
  | '$remove'
  | 'addHook'
  | 'changed'
  | 'decrement'
  | 'deletedAt'
  | 'destroy'
  | 'equals'
  | 'equalsOneOf'
  | 'get'
  | 'getDataValue'
  | 'hasHook'
  | 'hasHooks'
  | 'increment'
  | 'isNewRecord'
  | 'isSoftDeleted'
  | 'previous'
  | 'reload'
  | 'removeHook'
  | 'restore'
  | 'save'
  | 'sequelize'
  | 'set'
  | 'setAttributes'
  | 'setDataValue'
  | 'toJSON'
  | 'update'
  | 'validate'
  | 'version'
  | 'where'
  | '_model'
  | '_attributes'
  | '_creationAttributes'
  | 'dataValues'
>;
