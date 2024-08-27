import { ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import _ from 'lodash';
import { IncludeOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { ParseWherePipe } from './parseWhere.pipe';
import { Logger } from '@core/logger/Logger';

export class ParseIncludePipe<T extends Model> {
  private logger: Logger = new Logger(ParseIncludePipe.name);
  constructor(private model: ModelCtor<T>) {}
  transform(value: string, metadata: ArgumentMetadata) {
    try {
      let include: Array<object | string> = [];
      const populate: string = value ?? '[]';
      if (_.isString(populate)) include = JSON.parse(populate);
      if (!Array.isArray(include)) throw Error();
      return this.parseInclude(include);
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        `Validation failed for ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async parseInclude(
    include: Array<object | string>,
  ): Promise<IncludeOptions[]> {
    const tryWithFilter = (m: string, model: ModelCtor<T>, querys?: any) => {
      if (!m.length) {
        throw Error();
      }
      /*
       Two options here:
       1. We have a Model name (like User) or a Model name with filter (like User.filter)
       2. We have the name of the property for the association (like 'user' or 'owner')

       1 always starts with uppercase, 2 with lowercase
      */
      const start = m[0];
      if (start === start.toLowerCase()) {
        // 2. name of the property
        // Get association data from model
        const association = model.associations[m];
        if (association == null) {
          throw Error();
        }
        const targetModel = association.target;
        const as = association.as;
        return { model: targetModel, as, required: false };
      }

      // 1. We have the Model name
      if (m.includes('.')) {
        const splt = m.split('.'),
          modelName = splt[0],
          filterName = splt[1];

        const model = this.getModelFromList(modelName);

        //return {model: model, where: where, required: false};
        if (model['filter'] != null) {
          return model['filter'](filterName) as IncludeOptions;
        }
      }

      const { where, required, as } = querys ?? {};

      return {
        model: this.getModelFromList(m),
        where: ParseWherePipe.sanitizeWhere(where),
        as,
        required: !!required,
      } as IncludeOptions;
    };

    const parseIncludeRecursive = (
      item,
      model: ModelCtor<T>,
    ): IncludeOptions => {
      if (_.isString(item)) {
        // Simple include
        return tryWithFilter(item, model);
      } else {
        // Include with nested includes
        let modelName: string = Object.keys(item)[0];
        let content = item[modelName];
        let querys = null;

        if (modelName === 'model') {
          const { model: newItem, ...props } = item;
          querys = props;

          if (_.isString(newItem)) {
            return tryWithFilter(newItem, model, querys);
          }

          modelName = Object.keys(newItem)[0];
          content = newItem[modelName];
        }

        if (!Array.isArray(content)) {
          throw Error();
        }

        const result: any = tryWithFilter(modelName, model, querys);
        result.include = content.map((i) =>
          parseIncludeRecursive(i, result.model),
        );

        return result;
      }
    };
    const preparedInclude = include.map((item) =>
      parseIncludeRecursive(item, this.model),
    );
    return preparedInclude;
  }
  getModelFromList(modelName) {
    try {
      return this.model.sequelize.model(modelName);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `${modelName} is invalid for include`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
