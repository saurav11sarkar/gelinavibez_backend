import { Types } from 'mongoose';

export interface IAdminTracker {
  adminId: Types.ObjectId;
  action: 'create' | 'update' | 'delete'|'add';
  model: string;
  targetId: Types.ObjectId;
  description?: string;
  ipAddress: string;
}
