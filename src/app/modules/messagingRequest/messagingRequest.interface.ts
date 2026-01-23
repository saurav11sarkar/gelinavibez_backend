import { Types } from 'mongoose';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface IMessagingRequest {
  requester: Types.ObjectId;
  target: Types.ObjectId;
  status: RequestStatus;
}
