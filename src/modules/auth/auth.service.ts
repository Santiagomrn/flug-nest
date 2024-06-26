import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { User } from '@modules/user/entities/user.entity';
import { config } from '@config/index';
import { add } from 'date-fns';
import * as uuid from 'uuid';
import _ from 'lodash';
import { UserRepository } from '@modules/user/user.repository';
import { Logger } from '@core/logger/Logger';
import { Plain } from '@libraries/BaseModel';
import { FederatedCredentialRepository } from './federatedCredential.Repository';
import crypto from 'crypto';
import { FederatedUserDto } from '@modules/auth/dto/federatedUser.dto';
import { RoleRepository } from '@modules/role/role.repository';
import { ROLES } from '@modules/role/enums/roles.enum';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';
import { MailingService } from '@modules/email/email.service';
import { ResetPasswordDto } from '@modules/auth/dto/resetPassword.dto';
import { ResetPasswordEmailDto } from './dto/resetPasswordEmail.dto';
import { TokenDto } from './dto/token.dto';
import { Role } from '@modules/role/entities/role.entity';

export interface Token {
  token: string;
  expires: number;
  expires_in: number;
}
export enum TOKEN_TYPE {
  ACCESS = 'access',
  REFRESH = 'refresh',
  CONFIRM = 'confirm',
  RESET = 'reset',
}
export interface IJwtPayload {
  id: number;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  roles: { id: number; name: string }[];
}
@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private federatedCredentialRepository: FederatedCredentialRepository,
    private roleRepository: RoleRepository,
    private emailService: MailingService,
  ) {}
  public async signIn(singInDto: SignInDto) {
    const user =
      await this.userRepository.findOneByEmailAndIsActiveTrueIncludeRole(
        singInDto.email,
      );
    const isAuthenticated = await user.authenticate(singInDto.password);

    if (isAuthenticated === true) {
      return this.createCredentials(user);
    } else {
      throw new UnauthorizedException();
    }
  }
  public async refreshToken(refreshTokenDto: TokenDto) {
    const jwtPayload = this.validateJwt(
      refreshTokenDto.token,
      TOKEN_TYPE.REFRESH,
    );
    const user = await this.userRepository.findOneById(jwtPayload.id, [Role]);
    return this.createCredentials(user);
  }
  public async signUp(createUserDto: CreateUserDto) {
    const user = await this.createUser(createUserDto);
    const token = await this.createToken(user, TOKEN_TYPE.CONFIRM);
    await this.emailService.sendConfirmationEmail(user, token.token);
    return UserResponseDto.fromUser(user);
  }

  public async createToken(
    user: Plain<User>,
    type: TOKEN_TYPE,
  ): Promise<Token> {
    const expiryUnit: string = config.jwt[type].expiry.unit;
    const expiryLength: number = config.jwt[type].expiry.length;
    const roles = user.roles;

    const expires =
      add(new Date(), { [expiryUnit]: expiryLength }).valueOf() / 1000;
    const issued = Date.now() / 1000;
    const expires_in = expires - issued; // seconds

    const token = await this.jwtService.signAsync({
      id: user.id,
      sub: config.jwt[type].subject,
      aud: config.jwt[type].audience,
      exp: expires,
      iat: issued,
      jti: uuid.v4(),
      email: user.email,
      roles: roles,
    });

    return {
      token: token,
      expires: expires,
      expires_in: expires_in,
    };
  }
  public async createCredentials(user: Plain<User>) {
    const accessToken = await this.createToken(user, TOKEN_TYPE.ACCESS);
    const refreshToken = await this.createToken(user, TOKEN_TYPE.REFRESH);
    const credentials = {
      token: accessToken.token,
      expires: accessToken.expires,
      refresh_token: refreshToken,
      user: _.pick(user, ['id', 'name', 'email']),
      roles: user.roles,
    };
    return credentials;
  }
  public async confirmEmail(token: string) {
    const jwtPayload = this.validateJwt(token, TOKEN_TYPE.CONFIRM);
    const user = await this.userRepository.findOneById(jwtPayload.id);
    await user.confirmEmail();
  }
  public async resetPasswordEmail(
    resetPasswordEmailDto: ResetPasswordEmailDto,
  ) {
    try {
      const user = await this.userRepository.findOneByEmail(
        resetPasswordEmailDto.email,
      );
      const token = await this.createToken(user, TOKEN_TYPE.RESET);
      await this.emailService.sendResetPasswordTokenEmail(user, token.token);
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
    }
  }
  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const jwtPayload = this.validateJwt(
      resetPasswordDto.token,
      TOKEN_TYPE.RESET,
    );
    const userId = jwtPayload.id;
    const user = await this.userRepository.update(userId, {
      password: resetPasswordDto.password,
    });
    return UserResponseDto.fromUser(user);
  }

  public async googleAuthRedirect(federatedUser: FederatedUserDto) {
    try {
      return await this.googleSingIn(federatedUser);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        const user = await this.createFederatedUser(federatedUser);
        return await this.createCredentials(user);
      }
      throw error;
    }
  }

  private async googleSingIn(googleUser: FederatedUserDto) {
    try {
      const federatedCredentials =
        await this.federatedCredentialRepository.findOneByProviderAndSubject(
          googleUser.provider,
          googleUser.id,
        );
      const user = await this.userRepository.findOneById(
        federatedCredentials.userId,
      );
      return await this.createCredentials(user);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
  private async createFederatedUser(federatedUser: FederatedUserDto) {
    let user: User;
    await this.userRepository.executeTransaction(async (t) => {
      user = await this.userRepository.create(
        {
          firstName: federatedUser.firstName,
          lastName: federatedUser.firstName,
          email: federatedUser.email as string,
          isEmailConfirmed: true,
          password: crypto.randomBytes(48).toString('hex') as string,
          authType: federatedUser.authType,
        },
        t,
      );
      const role = await this.roleRepository.findByName(ROLES.USER, t);
      await user.addRole(role.id, t);
      await user.addFederatedCredential(
        {
          provider: federatedUser.provider,
          subject: federatedUser.id,
        },
        t,
      );
    });

    return user;
  }
  private validateJwt(token: string, type = TOKEN_TYPE.ACCESS) {
    this.jwtService.verify(token);
    const jwtPayload = this.jwtService.decode<IJwtPayload>(token);
    // If audience doesn't match
    if (config.jwt[type].audience !== jwtPayload.aud) {
      throw new ForbiddenException(
        'This token cannot be accepted for this domain.',
      );
    }
    // If the subject doesn't match
    if (config.jwt[type].subject !== jwtPayload.sub) {
      throw new ForbiddenException(
        'This token cannot be accepted for this domain.',
      );
    }
    return jwtPayload;
  }
  private async createUser(createUserDto: CreateUserDto) {
    let user: User = null;
    await this.userRepository.executeTransaction(async (t) => {
      user = await this.userRepository.create(createUserDto, t);
      const userRole = await this.roleRepository.findByName(ROLES.USER, t);
      await user.addRole(userRole.id, t);
    });
    return user;
  }
}
