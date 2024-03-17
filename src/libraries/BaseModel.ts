import { User } from '@modules/user/entities/user.entity';
import { Column, DataType, Model, PrimaryKey } from 'sequelize-typescript';

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

  toJSON(): Plain<T> {
    return super.toJSON() as Plain<T>;
  }
}

export type Plain<T extends Model<T>> = OmitFunctions<
  MagicToExtractRealType<T>
>;
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

export class u implements Partial<Plain<User>> {
  id: number;
  email: string;
}
