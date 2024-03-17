#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { program } = require('commander');
const { generateController } = require('./generateController.js');
const { generateCreateDto, generateUpdateDto } = require('./generateDtos.js');
const { generateService } = require('./generateService.js');
const { generateRepository } = require('./generateRepository.js');
const { generateEntity } = require('./genertateEntity.js');
const {
  generateFactories,
  generateControllerSpec,
  generateControllerE2E,
} = require('./generateSpecs.js');
const path = require('path');
const fs = require('fs');
const { generateModule } = require('./generateModule.js');

const saveFile = async (name, dir, template) => {
  const filename = path.join(dir, name + '.ts');
  fs.writeFileSync(filename, template);
};
const generateApiModule = async (moduleName, _options) => {
  moduleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  let isCustomFilesCreation = false;
  if (
    _options.entity ||
    _options.repository ||
    _options.service ||
    _options.controller ||
    _options.dto
  )
    isCustomFilesCreation = true;
  const options = {
    controller: !isCustomFilesCreation || _options.controller,
    service: !isCustomFilesCreation || _options.service || _options.controller,
    entity:
      !isCustomFilesCreation ||
      _options.entity ||
      _options.service ||
      _options.controller,
    dto: !isCustomFilesCreation || _options.dto || _options.controller,
    belongsUser: _options.belongsUser,
    specs: (!isCustomFilesCreation || _options.controller) && !_options.no_spec,
  };
  const lowerCaseModuleName = moduleName.toLowerCase();
  const controllerTemplate = generateController({
    name: moduleName,
    belongsUser: options.belongsUser,
  });
  const createDtoTemplate = generateCreateDto({
    name: moduleName,
    belongsUser: options.belongsUser,
  });
  const updateDtoTemplate = generateUpdateDto({
    name: moduleName,
    belongsUser: options.belongsUser,
  });
  const serviceTemplate = generateService({ name: moduleName });
  const repositoryTemplate = generateRepository({ name: moduleName });
  const entityTemplate = generateEntity({
    name: moduleName,
    belongsUser: options.belongsUser,
  });
  const moduleTemplate = generateModule({ name: moduleName, options });
  const factoryTemplate = generateFactories({
    name: moduleName,
    belongsUser: options.belongsUser,
  });
  const controllerSpecTemplate = generateControllerSpec({
    name: moduleName,
    belongsUser: options.belongsUser,
  });
  const controllerE2ETemplate = generateControllerE2E({
    name: moduleName,
    belongsUser: options.belongsUser,
  });

  const MODULES_DIR = path.join(process.cwd(), '/src/modules');
  const MODULE_DIR = path.join(MODULES_DIR, '/' + lowerCaseModuleName);
  const DTO_DIR = path.join(MODULE_DIR, '/dto');
  const ENTITIES_DIR = path.join(MODULE_DIR, '/entities');
  const TESTS_DIR = path.join(MODULE_DIR, '/tests');
  if (!fs.existsSync(MODULES_DIR)) {
    fs.mkdirSync(MODULES_DIR);
  }
  if (fs.existsSync(MODULE_DIR)) {
    return;
  }
  fs.mkdirSync(MODULE_DIR);

  if (options.controller)
    await saveFile(
      lowerCaseModuleName + '.controller',
      MODULE_DIR,
      controllerTemplate,
    );

  if (options.service)
    await saveFile(
      lowerCaseModuleName + '.service',
      MODULE_DIR,
      serviceTemplate,
    );

  if (options.entity) {
    fs.mkdirSync(ENTITIES_DIR);
    await saveFile(
      lowerCaseModuleName + '.entity',
      ENTITIES_DIR,
      entityTemplate,
    );
    await saveFile(
      lowerCaseModuleName + '.repository',
      MODULE_DIR,
      repositoryTemplate,
    );
  }

  if (options.dto) {
    fs.mkdirSync(DTO_DIR);
    await saveFile(
      'create-' + lowerCaseModuleName + '.dto',
      DTO_DIR,
      createDtoTemplate,
    );
    await saveFile(
      'update-' + lowerCaseModuleName + '.dto',
      DTO_DIR,
      updateDtoTemplate,
    );
  }
  if (options.specs) {
    fs.mkdirSync(TESTS_DIR);
    await saveFile('factories', TESTS_DIR, factoryTemplate);
    await saveFile(
      lowerCaseModuleName + '.controller.spec',
      TESTS_DIR,
      controllerSpecTemplate,
    );
    await saveFile(
      lowerCaseModuleName + '.e2e-spec',
      TESTS_DIR,
      controllerE2ETemplate,
    );
  }

  await saveFile(lowerCaseModuleName + '.module', MODULE_DIR, moduleTemplate);
};

async function main() {
  program
    .command('generate')
    .command('api')
    .argument('<moduleName>', 'name of the module')
    .option('-bU, --belongsUser', 'module belongs to user')
    .option('-e, --entity', 'generate entity')
    .option('-s, --service', 'generate service')
    .option('-c, --controller', 'generate controller')
    .option('-d, --dto', 'generate dto')
    .option('-n-s, --no-spec', 'no generate test files')
    .action(generateApiModule);

  program
    .command('g')
    .command('api')
    .argument('<moduleName>', 'name of the module')
    .option('-bU, --belongsUser', 'module belongs to user')
    .option('-d, --dto', 'generate dto')
    .option('-e, --entity', 'generate entity')
    .option('-s, --service', 'generate service')
    .option('-c, --controller', 'generate controller')
    .option('-n_s, --no_spec', 'no generate test files')
    .action(generateApiModule);

  await program.parseAsync(process.argv);
}

main();
