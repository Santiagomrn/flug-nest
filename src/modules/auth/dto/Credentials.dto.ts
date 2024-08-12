import { Plain } from '@libraries/baseModel.entity';
import { Role } from '@modules/role/entities/role.entity';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';
import { PickType } from '@nestjs/swagger';
import { Expose, plainToClass, Type } from 'class-transformer';

export class UserCredentialsDto extends PickType(UserResponseDto, [
  'id',
  'firstName',
  'email',
] as const) {}

export class CredentialsDto {
  @Expose()
  token: string;
  @Expose()
  expires: number;
  @Expose()
  refreshToken: string;
  @Expose()
  @Type(() => UserCredentialsDto)
  user: UserCredentialsDto;
  @Expose()
  roles: Role[] = undefined;

  static fromPlain(credentials: Partial<CredentialsDto>): CredentialsDto;
  static fromPlain(credentials: Partial<CredentialsDto>): CredentialsDto[];
  static fromPlain(
    credentials: object | object[],
  ): CredentialsDto | CredentialsDto[] {
    return plainToClass(CredentialsDto, credentials, {
      excludeExtraneousValues: true,
    });
  }
}
