function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}
exports.generateRepository = (opts) => {
  const { name } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();

  const template = `import { SequelizeCrudRepository } from 'src/libraries/SequelizeCrudRepository';
import { ${name} } from './entities/${lowerCaseName}.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ${name}Repository extends SequelizeCrudRepository<${name}> {
  constructor(
    @InjectModel(${name})
    protected model: typeof ${name},
    protected sequelize?: Sequelize,
  ) {
    super(sequelize);
  }
}
`;
  return template;
};
