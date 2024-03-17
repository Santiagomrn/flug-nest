function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}
exports.generateEntity = (opts) => {
  const { name, belongsUser = false } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();
  const belongsUserTemplate = `
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ApiHideProperty()
  @BelongsTo(() => User)
  user: User;`;

  const entityTemplate = `import {
  Column,
  DataType,
  Table,
  ${
    belongsUser
      ? ` ForeignKey,
  BelongsTo,`
      : ''
  }
} from 'sequelize-typescript';
import { BaseModel } from '@libraries/BaseModel';
${
  belongsUser
    ? `import { User } from 'src/modules/user/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';`
    : ''
}

@Table({
  tableName: '${lowerCaseName}',
})
export class ${name} extends BaseModel<${name}> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;
${belongsUser ? belongsUserTemplate : ''}
}
`;
  return entityTemplate;
};
