import { BaseModel } from '@libraries/baseModel.entity';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../userrole/entities/userrole.entity';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { ApiHideProperty } from '@nestjs/swagger';

@Table({
  tableName: 'role',
})
export class Role extends BaseModel<Role> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isDefault: boolean;

  @ApiHideProperty()
  @HasMany(() => UserRole, {
    hooks: true,
    onDelete: 'CASCADE',
  })
  userRoles?: UserRole[];

  @ApiHideProperty()
  @BelongsToMany(() => User, {
    through: {
      model: () => UserRole,
      unique: false,
    },
    constraints: false,
  })
  users?: User[];
}
