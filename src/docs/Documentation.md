## Technologies

This app uses the following technologies

- [NestJs](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/docs/tutorial.html)
- [Express](http://expressjs.com/en/4x/api.html)
- [Sequelize](http://docs.sequelizejs.com/en/latest/api/sequelize/)


It is recommended to have basic knowledge of those technologies before working with this project.

## Project structure

- **commons:** Common use utilities as dto's, decorators, pipes and interceptors.
- **config:** Global configuration for the app.
- **Core:** Core utilities such as database, logger and swagger configuration.
- **libraries** Base libraries for the project.
- **modules** Modules project code.
- **main.ts:** Application starting point, useful for initializing the services, specially for those that require to be started with a certain order.
- **declarations.d.ts:** Special Typescript declarations for the project

## Project tree
```bash
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── jest-e2e.config.ts
├── jest.config.ts
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── common
│   │   ├── decorators
│   │   │   ├── appendToBody.decorator.ts
│   │   │   ├── appendUser.decorator.ts
│   │   │   ├── filterOwner.decorator.ts
│   │   │   └── user.decorator.ts
│   │   ├── dto
│   │   │   └── paginated.dto.ts
│   │   ├── interceptors
│   │   │   ├── appendToBody.interceptor.ts
│   │   │   ├── appendUser.interceptor.ts
│   │   │   └── filterOwner.interceptor.ts
│   │   └── pipes
│   │       ├── parseAttributes.pipe.ts
│   │       ├── parseInclude.pipe.ts
│   │       ├── parseLimit.pipe.ts
│   │       ├── parseOffset.pipe.ts
│   │       ├── parseOrder.pipe.ts
│   │       └── parseWhere.pipe.ts
│   ├── config
│   │   └── index.ts
│   ├── core
│   │   ├── database
│   │   │   ├── config.ts
│   │   │   ├── database.sqlite
│   │   │   ├── database.ts
│   │   │   ├── migration.ts
│   │   │   ├── migrations
│   │   │   │   └── currentSchema.json
│   │   │   ├── seed.ts
│   │   │   ├── seedData.ts
│   │   │   └── testDatabase.ts
│   │   ├── logger
│   │   │   ├── Logger.ts
│   │   │   └── WinstonLogger.ts
│   │   └── swagger
│   │       ├── httpResponses
│   │       │   ├── Accepted.decorator.ts
│   │       │   ├── BadRequest.decorator.ts
│   │       │   ├── Conflict.decorator.ts
│   │       │   ├── Created.decorator.ts
│   │       │   ├── Forbidden.decorator.ts
│   │       │   ├── ImATeapot.decorator.ts
│   │       │   ├── InternalServerError.ts
│   │       │   ├── NotFound.decorator.ts
│   │       │   ├── Ok.decorator.ts
│   │       │   ├── OkPaginatedData.decorator.ts
│   │       │   ├── RequestTimeOut.decorator.ts
│   │       │   └── Unauthorized.decorator.ts
│   │       ├── parameters
│   │       │   ├── attributes.decorator.ts
│   │       │   ├── include.decorator.ts
│   │       │   ├── limit.decorator.ts
│   │       │   ├── offset.decorator.ts
│   │       │   ├── order.decorator.ts
│   │       │   └── where.decorator.ts
│   │       └── utils
│   │           ├── commonResponses.decorator.ts
│   │           └── pagination.decorator.ts
│   ├── declaration.d.ts
│   ├── docs
│   │   ├── CreateANoteApi.md
│   │   ├── Documentation.md
│   │   └── img
│   │       ├── SQLite viewer.png
│   │       ├── create_note.png
│   │       ├── database.png
│   │       ├── login.png
│   │       └── login_response.png
│   ├── libraries
│   │   ├── BaseModel.ts
│   │   ├── SequelizeCrudRepository.ts
│   │   ├── cli
│   │   │   ├── generateController.js
│   │   │   ├── generateDtos.js
│   │   │   ├── generateModule.js
│   │   │   ├── generateRepository.js
│   │   │   ├── generateService.js
│   │   │   ├── generateSpecs.js
│   │   │   ├── generateTests.js
│   │   │   ├── genertateEntity.js
│   │   │   └── index.js
│   │   ├── intefaces
│   │   │   └── IFindOne.ts
│   │   ├── migrations
│   │   │   ├── makemigration.ts
│   │   │   ├── migrate.ts
│   │   │   └── migrationGenerator.ts
│   │   └── util.ts
│   ├── main.ts
│   └── modules
│       ├── auth
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── decorators
│       │   │   ├── isOwner.decorator.ts
│       │   │   ├── isRole.decorator.ts
│       │   │   ├── isSelfUser.decorator.ts
│       │   │   ├── isSelfUserOrIsRole.decorator.ts
│       │   │   └── validateJWT.decorator.ts
│       │   ├── dto
│       │   │   ├── federatedUser.dto.ts
│       │   │   └── signIn.dto.ts
│       │   ├── entities
│       │   │   └── federatedCredential.entity.ts
│       │   ├── federatedCredential.Repository.ts
│       │   ├── guards
│       │   │   ├── GoogleOAuth.guard.ts
│       │   │   ├── isOwner.guard.ts
│       │   │   ├── isRole.guard.ts
│       │   │   ├── isSelfUser.guard.ts
│       │   │   ├── isSelfUserGuardOrIsRole.guard.ts
│       │   │   └── validateJWT.guard.ts
│       │   ├── strategies
│       │   │   └── google.strategy.ts
│       │   └── tests
│       │       ├── auth.controller.spec.ts
│       │       ├── auth.e2e-spec.ts
│       │       ├── isOwner.spec.ts
│       │       ├── isRole.guard.spec.ts
│       │       ├── isSelfUser.guard.spec.ts
│       │       └── isSelfUserGuardOrIsRole.guard.spec.ts
│       ├── email
│       │   ├── email.module.ts
│       │   ├── email.service.ts
│       │   └── templates
│       │       ├── email_confirmation.ejs
│       │       └── template.ejs
│       ├── note
│       │   ├── dto
│       │   │   ├── create-note.dto.ts
│       │   │   └── update-note.dto.ts
│       │   ├── entities
│       │   │   └── note.entity.ts
│       │   ├── note.controller.ts
│       │   ├── note.module.ts
│       │   ├── note.repository.ts
│       │   ├── note.service.ts
│       │   └── tests
│       │       ├── factories.ts
│       │       ├── note.controller.spec.ts
│       │       └── note.e2e-spec.ts
│       ├── role
│       │   ├── entities
│       │   │   └── role.entity.ts
│       │   ├── enums
│       │   │   └── roles.enum.ts
│       │   ├── role.module.ts
│       │   └── role.repository.ts
│       ├── user
│       │   ├── dto
│       │   │   ├── create-user.dto.ts
│       │   │   ├── update-user.dto.ts
│       │   │   └── user-response.dto.ts
│       │   ├── entities
│       │   │   └── user.entity.ts
│       │   ├── tests
│       │   │   ├── factories.ts
│       │   │   ├── user.controller.spec.ts
│       │   │   └── user.e2e-spec.ts
│       │   ├── user.controller.ts
│       │   ├── user.module.ts
│       │   ├── user.repository.ts
│       │   └── user.service.ts
│       └── userrole
│           ├── entities
│           │   └── userrole.entity.ts
│           ├── userrole.module.ts
│           └── userrole.repository.ts
├── tsconfig.build.json
└── tsconfig.json
```

### Query params

- **where**: Accepts JSON following a modified Sequelize query format. More details in the **Where query format** section.
- **limit**: number, max number of results to get
- **offset** : number, offset for the results to get, useful for pagination
- **order** : string or an Array of Arrays, specifying ordering for the results, format: `[["<column name>", "<ASC | DESC>"], ...]`
- **include**: Array< Object | string >: Specify the relations to populate, the members of the array can be strings with the name of the model to populate, the name of the model with a dot and a filter name, the name of the property for the association, or a object with a key of the same format as before that denotes an array with the same format of the parent one (recursive). Examples:

  ```
  include=["Profile", "profiles"]

  include=[{"model":"User","required":true}]
  ```


### Where query format

Flug-Nest query format is based on the Sequelize query format, but limited and adapted for security.

The contents of the `where` query param should be a JSON where the keys are either:

- The name of the parameter that we want to query in the Model, or
- One of the following supported operators:

  | Operator     | Sequelize equivalent |
  | ------------ | -------------------- |
  | \$eq         | Op.eq                |
  | \$ne         | Op.ne                |
  | \$gte        | Op.gte               |
  | \$gt         | Op.gt                |
  | \$lte        | Op.lte               |
  | \$lt         | Op.lt                |
  | \$not        | Op.not               |
  | \$in         | Op.in                |
  | \$notIn      | Op.notIn             |
  | \$is         | Op.is                |
  | \$like       | Op.like              |
  | \$startsWith | Op.startsWith        |
  | \$endsWith   | Op.endsWith          |
  | \$substring  | Op.substring         |
  | \$notLike    | Op.notLike           |
  | \$between    | Op.between           |
  | \$notBetween | Op.notBetween        |
  | \$and        | Op.and               |
  | \$or         | Op.or                |

You can get more details on how to write queries in the [Sequelize Querying documentation](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators).