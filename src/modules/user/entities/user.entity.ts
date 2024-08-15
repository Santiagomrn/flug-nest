import {
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { Role } from '@modules/role/entities/role.entity';
import { UserRole } from '@modules/userrole/entities/userrole.entity';
import { Transaction } from 'sequelize';
import { BaseModel } from '@libraries/baseModel.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { FederatedCredential } from '@modules/auth/entities/federatedCredential.entity';
export enum AuthType {
  Email = 'email',
  Microsoft = 'microsoft',
  Google = 'google',
}

@Table({
  tableName: 'user',
})
export class User extends BaseModel<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  // If the user can access the platform
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActive: boolean;

  // If the user account has been confirmed after creation
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isEmailConfirmed: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [8, 255],
    },
  })
  password: string;

  @Column({
    type: DataType.ENUM(AuthType.Email),
    allowNull: false,
    defaultValue: AuthType.Email,
  })
  authType: AuthType.Email | AuthType.Microsoft | AuthType.Google;

  @ApiHideProperty()
  @HasMany(() => UserRole, {
    hooks: true,
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

  @ApiHideProperty()
  @BelongsToMany(() => Role, {
    through: {
      model: () => UserRole,
      unique: false,
    },
    constraints: true,
  })
  roles: Role[];

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static activateIndividualHooks(items: Array<User>, options: any) {
    options.individualHooks = true;
  }

  @BeforeCreate
  static addPassword(user: User) {
    return user.updatePassword();
  }

  @BeforeUpdate
  static changePassword(user: User) {
    if (user.changed('password')) {
      return user.updatePassword();
    }
    return Promise.resolve();
  }

  authenticate(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  hashPassword(password: string): Promise<string> {
    if (password == null || password.length < 8)
      throw new Error('Invalid password');
    return bcrypt.hash(password, 10);
  }

  updatePassword(): Promise<void> {
    return this.hashPassword(this.password).then((result) => {
      this.password = result;
      return null;
    });
  }

  async addRole(roleId: number, t: Transaction = null): Promise<void> {
    await this.$create<UserRole>(
      UserRole.name,
      { roleId: roleId },
      {
        transaction: t,
      },
    );
  }
  addFederatedCredential(
    credentials: { provider: string; subject: string },
    t: Transaction = null,
  ) {
    return FederatedCredential.create(
      {
        ...credentials,
        userId: this.id,
      },
      { transaction: t },
    );
  }
}
