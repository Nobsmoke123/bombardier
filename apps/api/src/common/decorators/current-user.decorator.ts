import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserPublic } from '@job-tracker/types';

type AuthedRequest = {
  user: UserPublic;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserPublic => {
    const request = ctx.switchToHttp().getRequest<AuthedRequest>();
    return request.user;
  },
);
