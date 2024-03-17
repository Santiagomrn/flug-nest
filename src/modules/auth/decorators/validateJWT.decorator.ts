import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidateJWTGuard } from '../guards/validateJWT.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function ValidateJWT() {
  return applyDecorators(ApiBearerAuth(), UseGuards(ValidateJWTGuard));
}
