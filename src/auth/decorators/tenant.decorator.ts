import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const tenantId = request.user.activeTenantId;

    if (!tenantId) {
      throw new UnauthorizedException('Tenant not found in token');
    }

    return tenantId;
  },
);
