import { faker } from '@faker-js/faker';

import _ from 'lodash';
import { plainToClass } from 'class-transformer';
import { AuthType, User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FederatedUserDto } from '@modules/auth/dto/federatedUser.dto';

const createRandomUser = (): User => {
  return new User({
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    isActive: faker.datatype.boolean(),
    isEmailConfirmed: faker.datatype.boolean(),
    password: faker.internet.password(),
    authType: faker.helpers.enumValue(AuthType),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });
};

export function UserFactory(count: number): User[];
export function UserFactory(count?: number): User;
export function UserFactory(count: number): User[] | User {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomUser, { count });
  }
  return createRandomUser();
}

const createRandomCreateUserDto = (): CreateUserDto => {
  return plainToClass(CreateUserDto, {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  });
};

export function CreateUserDtoFactory(count: number): CreateUserDto[];
export function CreateUserDtoFactory(count?: number): CreateUserDto;
export function CreateUserDtoFactory(
  count: number,
): CreateUserDto[] | CreateUserDto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomCreateUserDto, { count });
  }
  return createRandomCreateUserDto();
}

const createRandomUpdateUserDto = (): UpdateUserDto => {
  return plainToClass(UpdateUserDto, {
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  });
};
export function UpdateUserDtoFactory(count: number): UpdateUserDto[];
export function UpdateUserDtoFactory(count?: number): UpdateUserDto;
export function UpdateUserDtoFactory(
  count: number,
): UpdateUserDto[] | UpdateUserDto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomUpdateUserDto, { count });
  }
  return createRandomUpdateUserDto();
}

enum Providers {
  Google = 'google',
  Microsoft = 'microsoft',
}
const createRandomFederatedUserDto = (): FederatedUserDto => {
  return plainToClass(FederatedUserDto, {
    id: faker.number.int(),
    email: faker.internet.email(),
    provider: faker.helpers.enumValue(Providers),
    authType: AuthType.Google,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    picture: faker.image.avatar(),
    accessToken: faker.string.alphanumeric(10),
    refreshToken: faker.string.alphanumeric(10),
  });
};
export function FederatedUserDtoFactory(count: number): FederatedUserDto[];
export function FederatedUserDtoFactory(count?: number): FederatedUserDto;
export function FederatedUserDtoFactory(
  count: number,
): FederatedUserDto[] | FederatedUserDto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomFederatedUserDto, { count });
  }
  return createRandomFederatedUserDto();
}
