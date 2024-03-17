import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { GoogleOAuthGuard } from './guards/GoogleOAuth.guard';
import { FederatedUserDto } from './dto/federatedUser.dto';
import { User } from '@decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('email/confirmation/:token')
  async confirmEmail(@Param('token') token: string) {
    return await this.authService.confirmEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  authGoogle() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@User() federatedUser: FederatedUserDto) {
    return await this.authService.googleAuthRedirect(federatedUser);
  }
}
