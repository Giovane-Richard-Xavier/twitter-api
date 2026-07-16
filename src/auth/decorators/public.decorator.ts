import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PublicTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    return request.tenantId;
  },
);
