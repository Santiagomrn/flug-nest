import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '@libraries/baseModel.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

@Table({
  tableName: 'federatedcredential',
  indexes: [{ fields: ['subject', 'provider'], unique: true }],
})
export class FederatedCredential extends BaseModel<FederatedCredential> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subject: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  provider: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ApiHideProperty()
  @BelongsTo(() => User)
  user: User;
}
