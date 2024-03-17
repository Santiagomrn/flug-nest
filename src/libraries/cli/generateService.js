function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}
exports.generateService = (opts) => {
  const { name } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();

  const template = `import { Injectable } from '@nestjs/common';
import { Create${name}Dto } from './dto/create-${lowerCaseName}.dto';
import { Update${name}Dto } from './dto/update-${lowerCaseName}.dto';
import { ${name}Repository } from './${lowerCaseName}.repository';
import { IncludeOptions, OrderItem, WhereOptions } from 'sequelize';
import { ${name} } from './entities/${lowerCaseName}.entity';

@Injectable()
export class ${name}Service {
  constructor(private ${lowerCaseName}Repository: ${name}Repository) {}
  async create(create${name}Dto: Create${name}Dto) {
    return await this.${lowerCaseName}Repository.create(create${name}Dto);
  }

  async findAll(options?: {
    include?: IncludeOptions[];
    where?: WhereOptions<${name}>;
    limit?: number;
    offset?: number;
    order?: OrderItem[];
    attributes?: string[];
  }) {
    return await this.${lowerCaseName}Repository.findAll(options);
  }

  async findOne(id: number, include?: IncludeOptions[], attributes?: string[]) {
    return await this.${lowerCaseName}Repository.findOneById(id, include, attributes);
  }

  async update(id: number, update${name}Dto: Update${name}Dto) {
    return await this.${lowerCaseName}Repository.update(id, update${name}Dto);
  }

  async remove(id: number) {
    return await this.${lowerCaseName}Repository.delete(id);
  }
}
`;
  return template;
};
