import { Types } from 'mongoose';

export interface ICallRequest {
  firstName: string;
  lastName: string;
  email: string;
  visiting: Types.ObjectId;
  phone: string;
  addNode: string;
  createBy: Types.ObjectId;
}
