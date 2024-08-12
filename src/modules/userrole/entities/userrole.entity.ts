import { BaseModel } from '@libraries/baseModel.entity';
import { Role } from '@modules/role/entities/role.entity';
import { User } from '@modules/user/entities/user.entity';
import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'userrole',
})
export class UserRole extends BaseModel<UserRole> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;
}
