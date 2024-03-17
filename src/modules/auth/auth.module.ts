import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@config/index';
import { UserModule } from '@modules/user/user.module';
import { FederatedCredential } from './entities/federatedCredential.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { GoogleStrategy } from './strategies/google.strategy';
import { FederatedCredentialRepository } from './federatedCredential.Repository';
import { RoleModule } from '@modules/role/role.module';

@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: config.jwt.secret,
    }),
    SequelizeModule.forFeature([FederatedCredential]),
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, FederatedCredentialRepository],
  exports: [AuthService],
})
export class AuthModule {}
