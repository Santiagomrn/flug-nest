# Flug-Nest ✈️ <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="40" alt="Nest Logo" /></a>

Flug-Nest is a template for web application development powered by [Sequelize-typescript](https://github.com/sequelize/sequelize-typescript#readme) and
[NestJs](https://github.com/nestjs/nest) framework, inspired on [flugzeug](https://github.com/Rodmg/flugzeug) framework. It provides modules, validators, interceptors, pipes, decorators, database migration system, logger, auto-generated swagger documentation and a cli tool to accelerate the development process.

## Quick Start

- [Documentation](./src/docs/Documentation.md)

- [Flugnest generator](https://www.npmjs.com/package/flugnest-generator)

- [Service Bus Module](https://www.npmjs.com/package/nestjs-azure-service-bus-transporter)

- [webSockets Module](https://docs.nestjs.com/websockets/gateways)

- [Build a note app](./src/docs/CreateANoteApi.md)

- [Design pattern implementations in TypeScript](https://github.com/Santiagomrn/design_patterns_in_typescript)

## Installation

Either through cloning with git or by using [Flugnest generator](https://www.npmjs.com/package/flugnest-generator) (the recommended way)

```bash
npm install -g flugnest-generator
```

Flugnest-generator is ready to use since is globally installed:

To generate an app run.

```bash
flugnest app [name of your app]
```

## CLI Module Generator

To generate a module run in the root of your app.

```bash
flugnest module [name of your module]
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

## Running tests

In the root directory run

```bash
# unit tests
$ npm run test

# coverage
$ npm run test:cov

# integration/end to end
$ npm run test:e2e

```

## Running the app

In the root directory run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Swagger

By default you can find the swagger documentation of your app here: http://localhost:3000/swagger
or
If you prefer view the documentation in a json format you can find it here: http://localhost:3000/swagger-json

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

## Commitlint

This project already has [commitlint](https://commitlint.js.org/) installed, to commit we recommend to use following prompt:

```bash
$ npm run commit
```

## Database

Please update your database access credentials on the .env file in the root of the project if needed.

SQLite is configured as a database engine by default, to change the database engine please refer to [Sequelize Dialect-Specific](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/) to install the required connector library.

### Docker postgres

```bash
$ docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

### Autogenerate migrations for changes on DB

```
$ npm run makemigration
```

**Please Note:** These migrations only create an "up" action, "down" actions need to be created manually if desired.

Feel free to manually modify the generated migration files in `src/core/database/migrations` to customize and solve those edge cases when needed.

### Execute migrations

```
$ npm run migrate
```
