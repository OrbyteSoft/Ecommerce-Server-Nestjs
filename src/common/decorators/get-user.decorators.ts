import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a string is passed to the decorator (e.g., @GetUser('id')),
    // it returns that specific property. Otherwise, returns the whole user.
    return data ? user?.[data] : user;
  },
);
