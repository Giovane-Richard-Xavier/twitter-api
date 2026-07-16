import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../../types/actions-type';
// import { AuditAction } from 'src/types/actions-type';

export const AUDIT_KEY = 'audit';

export const Audit = (data: { action: AuditAction; entity: string }) =>
  SetMetadata(AUDIT_KEY, data);
