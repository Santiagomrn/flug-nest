import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { FederatedUserDto } from '../dto/federatedUser.dto';
import { AuthType } from '@modules/user/entities/user.entity';
import { config } from '@config/index';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: config.auth.google.clientId,
      clientSecret:config.auth.google.clientSecret,
      callbackURL: 'http://localhost:3000/v1/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos, provider } = profile;
    const user: FederatedUserDto = {
      id: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      authType: AuthType.Google,
      accessToken,
      refreshToken,
      provider,
    };
    done(null, user);
  }
}
