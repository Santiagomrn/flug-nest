# Flug-Nest ✈️ <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="40" alt="Nest Logo" /></a>

Flug-Nest is a template for web application development powered by [Sequelize-typescript](https://github.com/sequelize/sequelize-typescript#readme) and
[NestJs](https://github.com/nestjs/nest) framework, inspired on [flugzeug](https://github.com/Rodmg/flugzeug) framework. It provides modules, validators, interceptors, pipes, decorators, database migration system, logger, auto-generated swagger documentation and a cli tool to accelerate the development process.

## Quick Start

- [Documentation](./src/docs/Documentation.md)

- [Build a note app](./src/docs/CreateANoteApi.md)

## Installation

```bash
$ npm install
```

## Running tests

```bash
# unit tests
$ npm run test

# coverage
$ npm run test:cov

# integration/end to end
$ npm run test:e2e

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
## Swagger

By default you can find the swagger docuementation of your app here: http://localhost:3000/swagger
or 
If you prefer view the documentation in a json format you can find it here: http://localhost:3000/swagger-json

## CLI (Windows)

Package.json already comes with a command to run the cli tools:

```bash
npm run flug-nest
```

Generate a fully module ready to use.

```bash
npm run flug-nest g api -- --help

> flug-nest@0.0.1 flug-nest
> node ./src/libraries/cli/index.js g api --help

Usage: index g api [options] <moduleName>

Arguments:
  moduleName          name of the module

Options:
  -bU, --belongsUser  module belongs to user
  -d, --dto           generate dto
  -e, --entity        generate entity
  -s, --service       generate service
  -c, --controller    generate controller
  -n_s, --no_spec     no generate test files
  -h, --help          display help for command
```

### Example

This will create a book module that belongs to the user.

```bash
npm run flug-nest g api book -- -bU
```

## CLI (Linux)

Run inside your project folder to install the cli tool:

```bash
npm i -g
```

Generate a fully module ready to use.

```bash
flug-nest g api --help

Usage: flug-nest g api [options] <moduleName>

Arguments:
  moduleName          name of the module

Options:
  -bU, --belongsUser  module belongs to user
  -d, --dto           generate dto
  -e, --entity        generate entity
  -s, --service       generate service
  -c, --controller    generate controller
  -n_s, --no_spec     no generate test files
  -h, --help          display help for command
```

### Example

This will create a book module that belongs to the user.

```bash
flug-nest g api book -bU
```

The options are used in case you do not need a complete module.

This will create a the book module but without the controller:

```bash
flug-nest g api book -s
```

This will create a the book module but without controller and service files:

```bash
flug-nest g api book -e
```

This will create a the book module but only the dto files:

```bash
flug-nest g api book -d
```

After create your module do not forget to register it into nest app in file `src/app.module.ts`

```ts
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [databaseModule, UserModule, BookModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
```

## Models/Entity

Please refer to [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript)
and [Sequelize Nest](https://docs.nestjs.com/recipes/sql-sequelize)

```ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '@libraries/BaseModel';
import { ApiHideProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

@Table({
  tableName: 'note',
})
export class Note extends BaseModel<Note> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ApiHideProperty() //hide property in openApi definition (swagger)
  @BelongsTo(() => User)
  user: User;
}
```

## Validators/Dto

Please refer to [Nest validation techniques](https://docs.nestjs.com/techniques/validation#auto-validation) and [Class-validator](https://www.npmjs.com/package/class-validator)

```ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateNoteDto {
  @IsNotEmpty() //indicates required for run time validator
  @IsString()
  name: string; //indicates required for swagger docs

  @IsOptional() //indicates optional for run time validator
  @IsString()
  title?: string; // ? indicates optional for swagger docs
}
```

## Controllers

Please refer to [Nest Controllers]('https://docs.nestjs.com/controllers')

```ts
@ApiExtraModels(Note) //add the Entity as a swagger schema
@ApiTags('notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'Create a Note' })
  @ApiCommonResponses() //add swagger common responses
  @ApiCreatedResponseData(Note) //Add created swagger response
  @AppendUser() //append userId to body
  @ValidateJWT() //validate jwt and add ApiBearerAuth swagger definition
  @Post()
  //validate CreateNoteDto following class validator decorators in CreateNoteDto
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto);
  }

  @ApiOperation({ summary: 'Get all Note entries' })
  @ApiQueryAttributes()
  @ApiQueryWhere()
  @ApiQueryInclude()
  @ApiQueryPagination()
  @ApiOkResponsePaginatedData(Note)
  @ApiCommonResponses()
  @FilterOwner()
  @ValidateJWT()
  @Get()
  findAll(
    @Query('where', ParseWherePipe) where?: WhereOptions,
    @Query('offset', ParseOffsetPipe) offset?: number,
    @Query('limit', ParseLimitPipe) limit?: number,
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
    @Query('order', ParseOrderPipe) order?: OrderItem[],
    @Query('include', new ParseIncludePipe(Note))
    include?: IncludeOptions[],
  ) {
    return this.noteService.findAll({
      where,
      attributes,
      offset,
      limit,
      include,
      order,
    });
  }

  @ApiOperation({ summary: 'Get Note entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(Note)
  @ApiQueryAttributes()
  @ApiQueryInclude()
  @IsOwner(NoteService)
  @ValidateJWT()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include', new ParseIncludePipe(Note))
    include?: IncludeOptions[],
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
  ) {
    return this.noteService.findOne(+id, include, attributes);
  }

  @ApiOperation({ summary: 'Update Note entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(Note)
  @IsOwner(NoteService)
  @ValidateJWT()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @ApiOperation({ summary: 'Delete Note entry by id' })
  @ApiCommonResponses()
  @HttpCode(204)
  @IsOwner(NoteService)
  @ValidateJWT()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.remove(+id);
  }
}
```

## Swagger

Please refer to [Nest OpenApi](https://docs.nestjs.com/openapi/introduction)

## Database

Please update your database access credentials on the .env file in the root of the project if needed.

SQLite is configured as a database engine by default, to change the database engine please refer to [Sequelize Dialect-Specific](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/) to install the required connector library.

### Docker postgres
```bash	
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```
### Autogenerate migrations for changes on DB

```
npm run makemigration
```

**Please Note:** These migrations only create an "up" action, "down" actions need to be created manually if desired.

Feel free to manually modify the generated migration files in `src/core/database/migrations` to customize and solve those edge cases when needed.

### Execute migrations

```
npm run migrate
```
