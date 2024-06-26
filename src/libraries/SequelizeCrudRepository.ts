import {
  CreationAttributes,
  Identifier,
  IncludeOptions,
  Includeable,
  Sequelize,
  Transaction,
} from 'sequelize';
import { FindAttributeOptions, OrderItem, WhereOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { config } from 'src/config';
import { logger } from '@core/logger/Logger';
import { PaginatedDto } from '@common/dto/paginated.dto';
import { NotFoundException } from '@nestjs/common';

export abstract class SequelizeCrudRepository<T extends Model> {
  protected model: ModelCtor<T>;
  constructor(protected sequelize?: Sequelize) {}
  async create(reg: CreationAttributes<T>, t: Transaction = null) {
    return (await this.model.create(reg, { transaction: t })) as T;
  }
  async update(
    id: Identifier,
    reg: Partial<T>,
    t: Transaction = null,
  ): Promise<T> {
    const resource: T = await this.findOneByPk(id, {}, t);
    await resource.update(reg, { transaction: t });
    return resource;
  }
  async delete(id: Identifier, t: Transaction = null): Promise<void> {
    const resource: T = await this.findOneByPk(id, {}, t);
    if (resource === null)
      throw new NotFoundException(
        `Unable to delete ${this.model.name} with id: ${id}, Not Found`,
      );
    return await resource.destroy({ transaction: t });
  }
  async findOneById(
    id: number,
    include: Includeable | Includeable[] = [],
    attributes: string[] = null,
    t: Transaction = null,
  ): Promise<T> {
    const resource: T = await this.findOne(
      {
        attributes,
        where: { id } as WhereOptions<T>,
        include: include,
      },
      t,
    );
    return resource as T;
  }
  async findOneByPk(
    pk: Identifier,
    options: {
      attributes?: FindAttributeOptions;
      include?: Includeable | Includeable[];
    },
    t: Transaction = null,
  ): Promise<T> {
    const { attributes = null, include = [] } = options;
    const resource: T = await this.model.findByPk(pk, {
      attributes,
      include,
      transaction: t,
    });
    if (resource === null)
      throw new NotFoundException(`${this.model.name} with Pk:${pk} Not Found`);
    return resource;
  }
  async findAndCountAll(
    options: {
      where?: WhereOptions<T>;
      limit?: number;
      offset?: number;
      order?: OrderItem[];
      attributes?: string[];
      include?: Includeable | Includeable[];
    } = {
      where: {},
      limit: config.api.limit,
      offset: config.api.offset,
      order: null,
      attributes: null,
      include: [],
    },
    t: Transaction = null,
  ): Promise<PaginatedDto<T>> {
    const {
      limit = config.api.limit,
      offset = config.api.offset,
      order = null,
      where = {},
      attributes = null,
      include = [],
    } = options;
    const result = await this.model.findAndCountAll({
      include: include,
      limit,
      offset,
      order,
      where,
      attributes,
      transaction: t,
    });
    return {
      count: result.count,
      limit: limit,
      offset: offset,
      data: result.rows as T[],
    };
  }
  async findAll(
    options: {
      where?: WhereOptions<T>;
      limit?: number;
      offset?: number;
      order?: OrderItem[];
      attributes?: string[];
      include?: Includeable | Includeable[];
    } = {
      where: {},
      limit: null,
      offset: null,
      order: null,
      attributes: null,
      include: [],
    },
    t: Transaction = null,
  ): Promise<T[]> {
    const {
      limit = null,
      offset = null,
      order = null,
      where = {},
      attributes = null,
      include = [],
    } = options;
    const result = await this.model.findAll({
      include: include,
      limit,
      offset,
      order,
      where,
      attributes,
      transaction: t,
    });
    return result;
  }
  async findOne(
    options: {
      where?: WhereOptions<T>;
      attributes?: FindAttributeOptions;
      include?: Includeable | Includeable[];
    },
    t: Transaction = null,
  ): Promise<T> {
    const { where = {}, attributes = null, include = [] } = options;
    const resource: T = await this.model.findOne({
      include: include,
      where,
      attributes,
      transaction: t,
    });
    if (resource === null)
      throw new NotFoundException(
        `${this.model.name} where: ${JSON.stringify(where)} Not Found`,
      );
    return resource;
  }

  async executeTransaction(fn: (t: Transaction) => Promise<void>) {
    return await this.sequelize.transaction(async (t) => {
      try {
        await fn(t);
      } catch (err: unknown) {
        logger.error(err);
        throw err;
      }
    });
  }
  async getTransaction(): Promise<Transaction> {
    return await this.sequelize.transaction();
  }
}
