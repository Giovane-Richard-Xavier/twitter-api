export type UserPayload = {
  sub: string;
  email: string;
  name: string;
  globalRole?: string | null;
  activeTenantId?: string | null;
  role?: string | null;
  tenants?: {
    tenantId: string;
    role: string;
  }[];
};
