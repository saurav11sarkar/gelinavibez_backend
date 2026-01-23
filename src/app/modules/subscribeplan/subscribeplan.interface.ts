import { Types } from 'mongoose';

export interface ISubscribePlan {
  name: string;
  type: 'monthly' | 'yearly';
  price: number;
  features: string;
  status: 'active' | 'inactive';
  user: Types.ObjectId;
  subscriptionUser?: Types.ObjectId[];
}
