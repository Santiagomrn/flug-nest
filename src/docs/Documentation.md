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