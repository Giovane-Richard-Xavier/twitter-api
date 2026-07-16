import { UserPayload } from './userPayload';

// export class AuthRequest {
//   user: UserPayload;
// }

export interface AuthRequest extends Request {
  user: {
    id: string;
    globalRole?: string;
    tenants?: {
      tenantId: string;
      role: string;
    }[];
  };
}
