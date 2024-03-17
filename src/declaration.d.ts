import core from 'express-serve-static-core';

import { IJwtPayload } from '@modules/auth/auth.service';

declare module 'express' {
  interface Request<
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query,
    Locals extends Record<string, any> = Record<string, any>,
  > extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals> {
    session?: { jwt: IJwtPayload; where?: any[] } & {
      [key: string]: unknown;
    };
    query: {
      where?: string | object[];
      include?: string;
      attributes?: string;
      limit?: string;
      offset?: string;
    } & { [key: string]: unknown } & ReqQuery;
    params: { id?: string } & { [key: string]: unknown } & P;
  }
}
