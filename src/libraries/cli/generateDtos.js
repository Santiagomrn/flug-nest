function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}
exports.generateCreateDto = (opts) => {
  const { name, belongsUser = false } = opts;
  if (!isString(name)) throw Error();

  const template = belongsUser
    ? `import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';
export class Create${name}Dto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  name: string;

  @ApiHideProperty()
  @IsNumber()
  userId: number;
}
`
    : `import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class Create${name}Dto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  name: string;
}
`;
  return template;
};

exports.generateUpdateDto = (opts) => {
  const { name } = opts;
  if (!isString(name)) throw Error();

  const template = `import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class Update${name}Dto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  name?: string;
}
`;
  return template;
};
