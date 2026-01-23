import { Types } from 'mongoose';

export interface Iservice {
  name: string;
  createBy: Types.ObjectId;
}
