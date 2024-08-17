import { FindOptions, WhereAttributeHash } from 'sequelize';
import { Op } from 'sequelize';
import { ColumnReference } from 'sequelize';
import {
  AssociationActionOptions,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';
import { Cast, Fn, Json, Literal, Where } from 'sequelize/types/utils';

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

type InvalidInSqlArray = ColumnReference | Fn | Cast | null | Literal;

/**
 * This type allows using `Op.or`, `Op.and`, and `Op.not` recursively around another type.
 * Plain Array as an alias for `Op.and`. (unlike {@link AllowNotOrAndRecursive}).
 *
 * Example of plain-array treated as `Op.and`:
 * User.findAll({ where: [{ id: 1 }, { id: 2 }] });
 *
 * Meant to be used by {@link ArrayWhereOptionss}.
 */
type AllowNotOrAndWithImplicitAndArrayRecursive<T> = OnlyArray<
  // this is the equivalent of Op.and
  | T
  | { [Op.or]: AllowArray<AllowNotOrAndWithImplicitAndArrayRecursive<T>> }
  | { [Op.and]: AllowArray<AllowNotOrAndWithImplicitAndArrayRecursive<T>> }
  | { [Op.not]: AllowNotOrAndWithImplicitAndArrayRecursive<T> }
>;

/**
 * This type allows using `Op.or`, `Op.and`, and `Op.not` recursively around another type.
 * Unlike {@link AllowNotOrAndWithImplicitAndArrayRecursive}, it does not allow the 'implicit AND Array'.
 *
 * Example of plain-array NOT treated as Op.and:
 * User.findAll({ where: { id: [1, 2] } });
 *
 * Meant to be used by {@link WhereAttributeHashValue}.
 */
type AllowNotOrAndRecursive<T> =
  | T
  | { [Op.or]: AllowArray<AllowNotOrAndRecursive<T>> }
  | { [Op.and]: AllowArray<AllowNotOrAndRecursive<T>> }
  | { [Op.not]: AllowNotOrAndRecursive<T> };
/**
 * Represents acceptable Dynamic values.
 *
 * Dynamic values, as opposed to {@link StaticValues}. i.e. column references, functions, etc...
 */
type DynamicValues<AcceptableValues> =
  | Literal
  | ColumnReference
  | Fn
  | Cast
  // where() can only be used on boolean attributes
  | (AcceptableValues extends boolean ? Where : never);

type OnlyArray<T> = T[];
type AllowArray<T> = T | T[];
type AllowAnyAll<T> =
  | T
  // Op.all: [x, z] results in ALL (ARRAY[x, z])
  // Some things cannot go in ARRAY. Op.values must be used to support them.
  | {
      [Op.all]:
        | Exclude<T, InvalidInSqlArray>[]
        | Literal
        | { [Op.values]: Array<T | DynamicValues<T>> };
    }
  | {
      [Op.any]:
        | Exclude<T, InvalidInSqlArray>[]
        | Literal
        | { [Op.values]: Array<T | DynamicValues<T>> };
    };

/**
 * The type accepted by array `where` option
 * Plain Array as an alias for `Op.and`
 *
 * Example of plain-array treated as `Op.and`:
 * User.findAll({ where: [{ id: 1 }, { id: 2 }] });
 */
export type ArrayWhereOptions<TAttributes extends Model = any> =
  AllowNotOrAndWithImplicitAndArrayRecursive<
    WhereAttributeHash<Plain<TAttributes>> | Literal | Fn | Where | Json
  >;
