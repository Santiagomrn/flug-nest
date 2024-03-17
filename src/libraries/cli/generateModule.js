function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}
exports.generateModule = (opts) => {
  const { name, options } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();
  const template = `import { Module } from '@nestjs/common';
${
  options.service
    ? `import { ${name}Service } from './${lowerCaseName}.service';`
    : ''
}
${
  options.controller
    ? `import { ${name}Controller } from './${lowerCaseName}.controller';`
    : ''
}
import { SequelizeModule } from '@nestjs/sequelize';
${
  options.entity
    ? `import { ${name} } from './entities/${lowerCaseName}.entity';`
    : ''
}
${
  options.entity
    ? `import { ${name}Repository } from './${lowerCaseName}.repository';`
    : ''
}

@Module({
  imports: [${options.entity ? `SequelizeModule.forFeature([${name}])` : ''}],
  controllers: [${options.controller ? `${name}Controller` : ''}],
  providers: [${options.service ? `${name}Service,` : ''}${
    options.entity ? ` ${name}Repository` : ''
  }],
  exports: [${options.entity ? `SequelizeModule` : ''}],
})
export class ${name}Module {}
`;

  return template;
};
