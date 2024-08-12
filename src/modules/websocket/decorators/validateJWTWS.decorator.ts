import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidateJWTWSGuard } from '../guards/ValidateJWTWS.guard';

export function ValidateJWTWS() {
  return applyDecorators(ApiBearerAuth(), UseGuards(ValidateJWTWSGuard));
}
